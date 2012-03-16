(function(djiaak, $, undefined) {
	//this thing queues up async functions and limits the number of concurrent requests
	djiaak.AsyncQueue = function() {
		var _queue = [];
		var _currentlyExecuting = 0;
		var _maxExecuting = 2;
		var _isRunning = false;
		
		var _update = function() {
			if (_isRunning) {
				while (_queue.length && _currentlyExecuting<_maxExecuting) {
					var func = _queue.splice(0,1)[0];
					func();
					_currentlyExecuting++;
				}
			}
		};
		
		var _add = function(func) {
			_queue.push(func);
			_update();
		};
		
		var _funcCompleted = function() {
			_currentlyExecuting--;
			_update();
		};
		
		var _start = function() {
			_isRunning = true;
			_update();
		};
		
		var _stop = function() {
			_isRunning = false;
			_update();
		};
		
		var _clear = function() {
			_queue = [];
		};
		
		return {
			add: _add,
			funcCompleted: _funcCompleted,
			start: _start,
			stop: _stop,
			clear: _clear
		};
	};
}(djiaak = djiaak || {}, jQuery));
