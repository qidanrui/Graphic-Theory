
function shortestPath111(list, start, end)
{
	var now = start;
	var path = [];
	var used = [];
	var lenOfList = Object.keys(list).length;
	var queue = new PriorityQueue(function(a, b) {
		return a.value - b.value;
	})
	for (var i = 0; i < lenOfList; ++i) {
		path[i] = {"value": 0, "pre": -1, "IDOfLink": -1};
		used[i] = false;
	}

	used[now] = true;
	while (now != end) {
		var numOfSuccessor = list[now].length;
		for(var i = 0; i < numOfSuccessor; ++i) {
			queue.addNode(list[now][i]);			
		}
		var smallest = queue.popNode();
		while (!queue.isEmpty() && used[smallest.ID] && used[smallest.next]) {
			smallest = queue.popNode();
		}
		if (queue.isEmpty()) {
			break;
		}
		used[smallest.ID] = true;
		used[smallest.next] = true;
		path[smallest.next] = {"value": smallest.value, "pre": smallest.ID, "ID": smallest.IDOfLink};
		now = smallest.next;
	}
	if (now != end) {
		return [];
	}

	var result = [];
	while (end != start) {
		result.push(path[end].ID);
		end = path[end].pre;
	}

	var handledResult = [];
	var len = result.length;
	for (var i = len - 1; i >= 0; --i) {
		handledResult.push(result[i]);
	}
	return handledResult;
}

function MST(list, start)
{
	var now = start.name;
	var path = [];
	var used = [];
	var lenOfList = Object.keys(list).length;
	var queue = new PriorityQueue(function(a, b) {
		return a.value - b.value;
	})
	for (var i = 0; i < lenOfList; ++i) {
		path[i] = {"value": 0, "pre": -1, "ID": -1};
		used[i] = false;
	}

	used[now] = true;
	while (true) {
		var numOfSuccessor = list[now].length;

		for(var i = 0; i < numOfSuccessor; ++i) {
			queue.addNode(list[now][i]);			
		}
		var smallest = queue.popNode();
		while (!queue.isEmpty() && used[smallest.ID] && used[smallest.next]) {
			smallest = queue.popNode();
		}
		if (queue.isEmpty()) {
			break;
		}
		used[smallest.ID] = true;
		used[smallest.next] = true;
		path[smallest.next] = {"value": smallest.value, "pre": smallest.ID, "ID": smallest.IDOfLink};			
		now = smallest.next;
	}

	var edge = [];
	for (var i = 0; i < lenOfList; ++i) {
		if (path[i].pre != -1) {
			edge.push(path[i].ID);
		}
	}
	return edge;
}

function pointCloseness1(list, node_info, links)
{
	var arr = {};
	var numOfVertex = node_info.length;
	var numOfLink = links.length;
	for (var i = 0; i < numOfVertex; ++i) {
		arr[i] = [];
		for (var j = 0; j < numOfVertex; ++j) {
			arr[i].push(10000);
		}
	}
	console.log(arr);
	for (var i = 0; i < numOfLink; ++i) {
		var m = links[i].source.name;
		var n = links[i].target.name;
		var w = links[i].value;
		arr[m][n] = arr[n][m] = w;
	}
	for (var i = 0; i < numOfVertex; ++i) {
		arr[i][i] = 0;
	}
	for (var k = 0; k < numOfVertex; ++k)
		for (var i = 0; i < numOfVertex; ++i)
			for (var j = 0; j < numOfVertex; ++j) {
				if (arr[i][j] > arr[i][k] + arr[k][j]) {
					arr[i][j] = arr[i][k] + arr[k][j];
				}
			}

	var sum = 0;
	var total = [];
	var temp = 0;
	for (var i = 0; i < numOfVertex; ++i) {
		for (var j = 0; j < numOfVertex; ++j) {
			temp += arr[i][j];
		}
		sum += temp;
		total.push(temp);
		temp = 0;
	}
	for (var i = 0; i < numOfVertex; ++i) {
		total[i] /= sum;	
	}
	return total;
}

function pointBetweeness1(list, node_info)
{
	var betweeness = [];
	var numOfVertex = node_info.length;
	for (var i = 0; i < numOfVertex; ++i) {
		betweeness[i] = 0;
	}

	for (var s = 0; s < numOfVertex; ++s) {
		var stack = [];
		var queue = [];
		var P = {};
		var sigema = [];
		var delta = [];
		var d = [];
		for (var j = 0; j < numOfVertex; ++j) {
			P[j] = [];
			sigema[j] = 0;
			d[j] = -1;
			delta[j] = 0;
		}
		sigema[s] = 1;
		d[s] = 0;

		queue.push(node_info[s]);
		while (queue.length > 0) {
			var v = queue.shift();
			stack.push(v);
			//console.log(v);
			var numOfSuccessor = list[v.id].length;
			for (var k = 0; k < numOfSuccessor; ++k) {
				var w = node_info[list[v.id][k].next];
				if (d[w.id] < 0) {
					queue.push(w);
					d[w.id] = d[v.id] + 1;
				}

				if (d[w.id] == d[v.id] + 1) {
					sigema[w.id] = sigema[w.id] + sigema[v.id];
					P[w.id].push(v);
				}
			}
		}

		while (stack.length > 0) {
			var w = stack.pop();
			var len = P[w.id].length;
			for (var i = 0; i < len; ++i) {
				var v = P[w.id][i];
				delta[v.id] = delta[v.id] + (sigema[v.id] / sigema[w.id]) * (1 + delta[w.id]);
				if (w.id != s) {
					betweeness[w.id] = betweeness[w.id] + delta[w.id];
				}
			}
		}
	}

	var blength = betweeness.length;
	var maxValue = 0;
	for (var i = 0; i < blength; i++){
		if (betweeness[i] > maxValue){
			maxValue = betweeness[i];
		}
	}
	for (var i = 0; i < blength; i++){
		betweeness[i] /= maxValue;
	}
	console.log(betweeness);
	return betweeness;
}

/*function strongConnectedComponent(list, node_info)
{
	var index = 0;
	var connected = [];
	var stack = [];
	var map = [];
	var numOfVertex = node_info.length;
	for (var i = 0; i < numOfVertex; ++i) {
		node_info[i]["index"] = undefined;
		node_info[i]["lowlink"] = undefined;
		map[i] = false;
	}
	for (var i = 0; i < numOfVertex; ++i) {
		if (node_info[i]["index"] == undefined) {
			strongConnect(node_info[i]);
		}
	}

	function strongConnect(v)
	{
		v.index = index;
		v.lowlink = index;
		++index;
		stack.push(v);
		map[v.ID] = true;

		var len = list[v.ID].length;
		for (var i = 0; i < len; ++i) {
			var w = node_info[list[v.ID][i].next];
			if (w.index == undefined) {
				strongConnect(w);
				v.lowlink = (v.lowlink < w.lowlink) ? v.lowlink : w.lowlink;
			}
			else if (inTheStack(w)) {
				v.lowlink = (v.lowlink < w.index) ? v.lowlink : w.index;
			}
		}

		if (v.lowlink == v.index) {
			connected.push([]);
			var tempLength = connected.length;
			while (true) {
				if (stack.length == 0)
					break;
				var w = stack.pop();
				map[w.ID] = false;
				connected[tempLength - 1].push(w);
				if (w.ID == v.ID) {
					break;
				}
			}
		}

		function inTheStack(w)
		{
			return map[w.ID];
		}

		return connected;
	}
}*/ //未修改

function connectedComponent1(list, node_info) {
	var connected = [];
	var stack = [];
	var componentId;
	var numOfVertex = node_info.length;
	for (var i = 0; i < numOfVertex; ++i) {
		node_info[i]["index"] = undefined;
	}
	
	function connectC(v)
	{
		v.index = 1;

		var len = list[v.id].length;
		for (var i = 0; i < len; ++i) {
			var w = node_info[list[v.id][i].next];
			if (w.index == undefined) {
				stack.push(list[v.id][i].IDOfLink);
				connectC(w);
			}
		}
	}
	
	for (var i = 0; i < numOfVertex; ++i) {
		if (node_info[i]["index"] == undefined) {
			connectC(node_info[i]);
			componentId = connected.length - 1;
			for (var val in stack){
				connected.push(val);
			}		
			stack = [];			
		}
	}

	return connected;
}
