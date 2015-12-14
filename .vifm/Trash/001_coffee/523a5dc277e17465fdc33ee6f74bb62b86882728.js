(function() {
  var Emitter, YouTube, fs, itag_formats, mp4, request;

  fs = require('fs');

  request = require('request');

  itag_formats = require('./formats.js');

  Emitter = require('event-kit').Emitter;

  mp4 = require('./iso_boxer.js');

  YouTube = (function() {
    var HEADER_SIZE, INFO_URL, VIDEO_EURL, duration, formats, videoInfo, ytid;

    INFO_URL = 'https://www.youtube.com/api_video_info?html5=1&hl=en_US&c=WEB&cplayer=UNIPLAYER&cver=html5&el=embedded&video_id=';

    VIDEO_EURL = 'https://youtube.googleapis.com/v/';

    HEADER_SIZE = 438;

    ytid = '';

    videoInfo = {};

    formats = [];

    duration = 0;

    function YouTube(url) {
      this.ytid = this.getYTId(url);
      this.emitter = new Emitter;
    }

    YouTube.prototype.getYTId = function(url) {
      var ytidregres, ytreg;
      if (url !== '') {
        ytreg = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/]{11})/i;
        ytidregres = ytreg.exec(url);
        if ((ytidregres != null ? ytidregres.length : void 0) > 0) {
          return ytid = ytidregres[1];
        }
      }
    };

    YouTube.prototype.parseTime = function(time) {
      var hours, mins, ms, res, result, secs, timeRegexp;
      timeRegexp = /(?:(\d+)h)?(?:(\d+)m(?!s))?(?:(\d+)s)?(?:(\d+)(?:ms)?)?/;
      result = timeRegexp.exec(time.toString());
      hours = result[1] || 0;
      mins = result[2] || 0;
      secs = result[3] || 0;
      ms = result[4] || 0;
      res = hours * 3600000 + mins * 60000 + secs * 1000 + parseInt(ms, 10);
      return res;
    };

    YouTube.prototype.on = function(event, func) {
      return this.emitter.on(event, func);
    };

    YouTube.prototype.getMap = function(map) {
      var data, i, key, streamData, streamMap, streams, value, _i, _j, _len, _len1, _ref;
      streamMap = map.split(',');
      streams = [];
      for (i = _i = 0, _len = streamMap.length; _i < _len; i = ++_i) {
        map = streamMap[i];
        streamData = map.split('&');
        for (_j = 0, _len1 = streamData.length; _j < _len1; _j++) {
          data = streamData[_j];
          _ref = data.split('='), key = _ref[0], value = _ref[1];
          if (streams[i] == null) {
            streams[i] = {};
          }
          streams[i][key] = unescape(value);
        }
      }
      return streams;
    };

    YouTube.prototype.getVideoInfo = function(url, next) {
      var reqUrl;
      if (url != null) {
        this.ytid = this.getYTId(url);
      }
      if (this.ytid === '') {
        return;
      }
      reqUrl = INFO_URL + this.ytid;
      return request(reqUrl, (function(_this) {
        return function(err, response, body) {
          var adaptive, info, itag, key, msg, old, param, paramStr, params, size, temp, urlDec, urlParams, value, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3;
          if (err != null) {
            return;
          }
          info = body.split('&');
          temp = {};
          for (_i = 0, _len = info.length; _i < _len; _i++) {
            param = info[_i];
            _ref = param.split('='), key = _ref[0], value = _ref[1];
            value = unescape(value);
            if (!Array.isArray(temp[key]) && (temp[key] != null)) {
              old = temp[key];
              temp[key] = [];
              temp[key].push(old);
            }
            if (Array.isArray(temp[key])) {
              temp[key].push(unescape(value));
            }
            if (temp[key] == null) {
              temp[key] = value;
            }
          }
          if (temp.status !== 'ok') {
            console.log('error', temp.reason);
            msg = temp.reason.toString('UTF-8').replace(/\+/gi, ' ');
            atom.notifications.addWarning(msg);
            return;
          }
          _this.basicStreams = _this.getMap(temp.url_encoded_fmt_stream_map);
          _this.adaptiveStreams = _this.getMap(temp.adaptive_fmts);
          _this.formats = {};
          _ref1 = _this.adaptiveStreams;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            adaptive = _ref1[_j];
            itag = adaptive.itag;
            if (adaptive.type.substr(0, 9) === 'video/mp4') {
              _this.formats[itag] = adaptive;
              if (_this.formats[itag].size != null) {
                size = _this.formats[itag].size.split('x');
                _this.formats[itag].width = size[0];
                _this.formats[itag].height = size[1];
              }
              _this.formats[itag].urlDecoded = unescape(adaptive.url);
              urlDec = _this.formats[itag].urlDecoded;
              _ref2 = /^https?\:\/\/[^?]+\?(.*)$/gi.exec(urlDec), url = _ref2[0], paramStr = _ref2[1];
              params = paramStr.split('&');
              urlParams = {};
              for (_k = 0, _len2 = params.length; _k < _len2; _k++) {
                param = params[_k];
                _ref3 = param.split('='), key = _ref3[0], value = _ref3[1];
                urlParams[key] = unescape(value);
              }
              _this.formats[itag].urlParams = urlParams;
            }
          }
          console.log('formats finished', _this.formats);
          _this.emitter.emit('formats', _this.formats);
          _this.emitter.emit('ready');
          if (next != null) {
            return next(_this.formats);
          }
        };
      })(this));
    };

    YouTube.prototype.parseRange = function(range) {
      var end, endMs, start, startMs, _ref;
      if (range != null) {
        _ref = range.split('-'), start = _ref[0], end = _ref[1];
        startMs = this.parseTime(start);
        endMs = this.parseTime(end);
        if (!stratS < endS) {
          return;
        }
        return [startMs, endMs];
      }
    };

    YouTube.prototype.findChunks = function(start, end, next) {
      var chunk, chunks, i, _i, _len, _ref;
      chunks = [];
      this.downloadIndexes = [];
      start = start / 1000 * this.timescale;
      end = end / 1000 * this.timescale;
      _ref = this.chunks;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        chunk = _ref[i];
        if (start < chunk.endTime && chunk.startTime < end) {
          chunks.push(chunk);
          this.downloadIndexes.push(i);
        }
      }
      this.chunksToDownload = chunks;
      if (next != null) {
        return next(chunks);
      }
    };

    YouTube.prototype.getChunk = function(index) {
      var chunk, host, range, reqObj, url;
      chunk = this.chunksToDownload[index];
      if (chunk != null) {
        range = chunk.startByte + '-' + chunk.endByte;
        url = this.formats[this.itag].urlDecoded + '&range=' + range;
        host = /^https?\:\/\/([^\/]+)\/.*/gi.exec(url);
        reqObj = {
          url: url,
          headers: {
            'Host': host[1]
          },
          encoding: 'binary'
        };
        return request(reqObj, (function(_this) {
          return function(err, res, body) {
            var buff, i, percent, _i, _ref;
            buff = new Uint8Array(body.length);
            for (i = _i = 0, _ref = body.length; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
              buff[i] = body.charCodeAt(i);
            }
            percent = (index / _this.chunksToDownload.length) * 100;
            _this.emitter.emit('data', {
              current: index,
              all: _this.chunksToDownload.length,
              data: buff,
              percent: percent
            });
            _this.chunks[index].data = body;
            _this.chunks[index].dataArray = buff.buffer;
            _this.downloadedChunks.push(_this.chunks[index]);
            if (index === _this.chunksToDownload.length - 1) {
              return _this.fileStream.end(body, 'binary', function(err) {
                if (err == null) {
                  return _this.emitter.emit('done', _this.downloadedChunks);
                }
              });
            } else {
              return _this.fileStream.write(body, 'binary', function(err) {
                if (err == null) {
                  return _this.getChunk(index + 1);
                }
              });
            }
          };
        })(this));
      } else {
        return this.emitter.emit('done', this.downloadedChunks);
      }
    };

    YouTube.prototype.getChunks = function() {
      this.downloadedChunks = [];
      return this.getChunk(0);
    };

    YouTube.prototype.parseTimes = function(obj) {
      this.start = 0;
      this.end = this.parseTime("10s");
      if (obj.time != null) {
        this.start = obj.time.start = this.parseTime(obj.time.start);
        return this.end = obj.time.end = this.parseTime(obj.time.end);
      }
    };

    YouTube.prototype.int32toBuff8 = function(number) {
      var buff8, buff8temp, i, int32, _i;
      int32 = new Uint32Array(1);
      int32[0] = number;
      buff8temp = new Uint8Array(int32.buffer.slice(0, 4));
      buff8 = new Uint8Array(4);
      for (i = _i = 0; _i <= 3; i = ++_i) {
        buff8[i] = buff8temp[3 - i];
      }
      return buff8;
    };

    YouTube.prototype.makeNewHeader = function(next) {
      var buff8, byte, checkNewHeader, chunk, delRefsSize, headerData, i, index, j, mdhd, mvhd, newDuration, newHeaderSize, newHeaderStr, newReferences, newRefsSize, newSidxSize, refCount, referencesOffset, sidx, tkhd, y, _i, _j, _k, _l, _len, _len1, _m, _n, _o, _p, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
      sidx = this.newHeader.fetch('sidx');
      refCount = sidx.reference_count;
      newRefsSize = this.downloadIndexes.length * 12;
      delRefsSize = sidx.reference_count * 12 - newRefsSize;
      newSidxSize = sidx.size - delRefsSize;
      newHeaderSize = this.newHeader._raw.byteLength - delRefsSize;
      sidx._raw.setUint32(0, newSidxSize);
      sidx._raw.setUint16(30, this.downloadIndexes.length);
      newReferences = new Uint8Array(newRefsSize);
      y = 0;
      _ref = this.downloadIndexes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        index = _ref[_i];
        for (j = _j = _ref1 = index * 12, _ref2 = index * 12 + 11; _ref1 <= _ref2 ? _j <= _ref2 : _j >= _ref2; j = _ref1 <= _ref2 ? ++_j : --_j) {
          byte = sidx._raw.getUint8(j + 32);
          newReferences[y] = byte;
          y++;
        }
      }
      headerData = new Uint8Array(newHeaderSize);
      for (i = _k = 0, _ref3 = newHeaderSize - 1; 0 <= _ref3 ? _k <= _ref3 : _k >= _ref3; i = 0 <= _ref3 ? ++_k : --_k) {
        headerData[i] = this.newHeader._raw.getUint8(i);
      }
      referencesOffset = sidx._offset + 32;
      for (i = _l = 0, _ref4 = newRefsSize - 1; 0 <= _ref4 ? _l <= _ref4 : _l >= _ref4; i = 0 <= _ref4 ? ++_l : --_l) {
        byte = newReferences[i];
        headerData[i + referencesOffset] = byte;
      }
      tkhd = this.newHeader.fetch('tkhd');
      mvhd = this.newHeader.fetch('mvhd');
      mdhd = this.newHeader.fetch('mdhd');
      newDuration = 0;
      _ref5 = this.chunksToDownload;
      for (_m = 0, _len1 = _ref5.length; _m < _len1; _m++) {
        chunk = _ref5[_m];
        newDuration += chunk.duration;
      }
      buff8 = this.int32toBuff8(newDuration);
      for (i = _n = 0; _n <= 3; i = ++_n) {
        headerData[mvhd._offset + 24 + i] = buff8[i];
      }
      for (i = _o = 0; _o <= 3; i = ++_o) {
        headerData[tkhd._offset + 28 + i] = buff8[i];
      }
      for (i = _p = 0; _p <= 3; i = ++_p) {
        headerData[mdhd._offset + 24 + i] = buff8[i];
      }
      checkNewHeader = mp4.parseBuffer(headerData.buffer);
      newHeaderStr = String.fromCharCode.apply(null, headerData);
      return this.fileStream.write(newHeaderStr, 'binary', (function(_this) {
        return function(err) {
          if (err != null) {
            return;
          }
          return next();
        };
      })(this));
    };

    YouTube.prototype.getHeader = function(next) {
      var host, indexRange, initRange, range, reqObj, url;
      initRange = this.formats[this.itag].init.split('-');
      indexRange = this.formats[this.itag].index.split('-');
      range = '0-' + indexRange[1];
      url = this.formats[this.itag].urlDecoded + '&range=' + range;
      host = /^https?\:\/\/([^\/]+)\/.*/gi.exec(url);
      reqObj = {
        url: url,
        headers: {
          'Host': host[1]
        },
        encoding: 'binary'
      };
      return request(reqObj, (function(_this) {
        return function(err, res, body) {
          var box, buff, chunk, endTime, i, offset, reference, startTime, text, time, _i, _j, _len, _ref, _ref1;
          _this.fileStream = fs.createWriteStream(_this.filename);
          buff = new Uint8Array(body.length);
          text = '';
          for (i = _i = 0, _ref = body.length; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
            buff[i] = body.charCodeAt(i);
          }
          box = mp4.parseBuffer(buff.buffer);
          _this.newHeader = mp4.parseBuffer(buff.buffer);
          _this.sidx = box.fetch('sidx');
          _this.mvhd = box.fetch('mvhd');
          _this.timescale = _this.mvhd.timescale;
          _this.references = _this.sidx.references;
          _this.chunks = [];
          offset = parseInt(indexRange[1]) + 1;
          time = 0;
          _ref1 = _this.references;
          for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
            reference = _ref1[_j];
            startTime = time;
            endTime = time + reference.subsegment_duration - 1;
            duration = reference.subsegment_duration;
            chunk = {
              startByte: offset,
              endByte: offset + reference.referenced_size - 1,
              startTime: startTime,
              endTime: endTime,
              size: reference.referenced_size,
              duration: duration
            };
            _this.chunks.push(chunk);
            offset += reference.referenced_size;
            time += reference.subsegment_duration;
          }
          _this.findChunks(_this.start, _this.end);
          return _this.makeNewHeader(function() {
            return next();
          });
        };
      })(this));
    };

    YouTube.prototype.download = function(obj) {
      if (obj.filename != null) {
        this.filename = obj.filename;
      } else {
        return;
      }
      if (obj.itag == null) {
        return;
      }
      this.itag = obj.itag;
      if (this.formats[this.itag] == null) {
        return;
      }
      this.parseTimes(obj);
      return this.getHeader((function(_this) {
        return function() {
          return _this.getChunks();
        };
      })(this));
    };

    YouTube.prototype.destroy = function() {
      return this.emitter.dispose();
    };

    return YouTube;

  })();

  module.exports = YouTube;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9zb3ZpZXQvLmF0b20vcGFja2FnZXMvZWRpdG9yLWJhY2tncm91bmQvbGliL3lvdXR1YmUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdEQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLE9BQUEsR0FBVSxPQUFBLENBQVEsU0FBUixDQURWLENBQUE7O0FBQUEsRUFFQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGNBQVIsQ0FGZixDQUFBOztBQUFBLEVBR0MsVUFBVyxPQUFBLENBQVEsV0FBUixFQUFYLE9BSEQsQ0FBQTs7QUFBQSxFQUlBLEdBQUEsR0FBTSxPQUFBLENBQVEsZ0JBQVIsQ0FKTixDQUFBOztBQUFBLEVBTU07QUFHSixRQUFBLHFFQUFBOztBQUFBLElBQUEsUUFBQSxHQUFXLGtIQUFYLENBQUE7O0FBQUEsSUFDQSxVQUFBLEdBQWEsbUNBRGIsQ0FBQTs7QUFBQSxJQUVBLFdBQUEsR0FBYyxHQUZkLENBQUE7O0FBQUEsSUFJQSxJQUFBLEdBQU8sRUFKUCxDQUFBOztBQUFBLElBS0EsU0FBQSxHQUFZLEVBTFosQ0FBQTs7QUFBQSxJQU1BLE9BQUEsR0FBVSxFQU5WLENBQUE7O0FBQUEsSUFPQSxRQUFBLEdBQVcsQ0FQWCxDQUFBOztBQVNZLElBQUEsaUJBQUMsR0FBRCxHQUFBO0FBQ1YsTUFBQSxJQUFDLENBQUEsSUFBRCxHQUFRLElBQUMsQ0FBQSxPQUFELENBQVMsR0FBVCxDQUFSLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxPQUFELEdBQVcsR0FBQSxDQUFBLE9BRFgsQ0FEVTtJQUFBLENBVFo7O0FBQUEsc0JBY0EsT0FBQSxHQUFTLFNBQUMsR0FBRCxHQUFBO0FBQ1AsVUFBQSxpQkFBQTtBQUFBLE1BQUEsSUFB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

//# sourceURL=/C:/Users/soviet/.atom/packages/editor-background/lib/youtube.coffee
