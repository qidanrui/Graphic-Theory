
/*function shortestPath(list, start, end)
{
	var now = start;
	var path = [];
	var used = [];
	var lenOfList = Object.keys(list).length;
	var queue = new PriorityQueue(function(a, b) {
		return a.weight - b.weight;
	})
	for (var i = 0; i < lenOfList; ++i) {
		path[i] = {"weight": 0, "pre": -1};
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
		path[smallest.next] = {"weight": smallest.weight, "pre": smallest.ID};
		now = smallest.next;
	}
	if (now != end) {
		return [];
	}

	var result = [];
	result.push(end);
	while (end != start) {
		result.push(path[end].pre);
		end = path[end].pre;
	}

	var handledResult = [];
	var len = result.length;
	for (var i = len - 1; i >= 0; --i) {
		handledResult.push(result[i]);
	}
	return handledResult;
}*/

function MST(list, vertex)
{
	var now = vertex;
	var path = [];
	var used = [];
	var lenOfList = list.length;
	var queue = new PriorityQueue(function(a, b) {
		return a.weight - b.weight;
	})
	for (var i = 0; i < lenOfList; ++i) {
		path[i] = -1;
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
		path[smallest.next] = smallest.ID;			
		now = smallest.next;
	}

	var edge = [];
	for (var i = 0; i < lenOfList; ++i) {
		if (path[i] != -1 && i != start) {
			edge.push({"node1": path[i], "node2": i});
		}
	}
	return edge;
	//return 1;
}

/*function pointCloseness(list, vertex, edge, start)
{
	var arr = {};
	var numOfVertex = vertex.length;
	var numOfEdge = edge.length;
	for (var i = 0; i < numOfVertex; ++i) {
		arr[i] = [];
		for (var j = 0; j < numOfVertex; ++j) {
			arr[i].push(10000);
		}
	}
	for (var i = 0; i < numOfEdge; ++i) {
		var m = data[i].node1;
		var n = data[i].node2;
		var w = data[i].weight;
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

	var total = [];
	var temp = 0;
	for (var i = 0; i < numOfVertex; ++i) {
		for (var j = 0; j < numOfVertex; ++j) {
			temp += arr[i][j];
		}
		total.push(temp);
		temp = 0;
	}
	return total;
}

function pointBetweeness(list, vertex)
{
	var betweeness = [];
	var numOfVertex = vertex.length;
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

		queue.push(vertex[s]);
		while (queue.length > 0) {
			var v = queue.shift();
			stack.push(v);
			var numOfSuccessor = list[v.ID].length;
			for (var k = 0; k < numOfSuccessor; ++k) {
				var w = vertex[list[v.ID][k].next];
				if (d[w.ID] < 0) {
					queue.push(w);
					d[w.ID] = d[v.ID] + 1;
				}

				if (d[w.ID] == d[v.ID] + 1) {
					sigema[w.ID] = sigema[w.ID] + sigema[v.ID];
					P[w.ID].push(v);
				}
			}
		}

		while (stack.length > 0) {
			var w = stack.pop();
			var len = P[w.ID].length;
			for (var i = 0; i < len; ++i) {
				var v = P[w.ID][i];
				delta[v.ID] = delta[v.ID] + (sigema[v.ID] / sigema[w.ID]) * (1 + delta[w.ID]);
				if (w.ID != s) {
					betweeness[w.ID] = betweeness[w.ID] + delta[w.ID];
				}
			}
		}
	}
	return betweeness;
}

function strongConnectedComponent(list, vertex)
{
	var index = 0;
	var connected = [];
	var stack = [];
	var map = [];
	var numOfVertex = vertex.length;
	for (var i = 0; i < numOfVertex; ++i) {
		vertex[i]["index"] = undefined;
		vertex[i]["lowlink"] = undefined;
		map[i] = false;
	}
	for (var i = 0; i < numOfVertex; ++i) {
		if (vertex[i]["index"] == undefined) {
			strongConnect(vertex[i]);
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
			var w = vertex[list[v.ID][i].next];
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
}

function connectedComponent(list, vertex) {
	var connected = [];
	var stack = [];
	var componentId;
	var numOfVertex = vertex.length;
	for (var i = 0; i < numOfVertex; ++i) {
		vertex[i]["index"] = undefined;
	}
	for (var i = 0; i < numOfVertex; ++i) {
		if (vertex[i]["index"] == undefined) {
			connectC(vertex[i]);
			connected.push([]);
			componentId = connected.length - 1;
			for (val in stack){
				connected[componentId].push(val);
			}		
			stack = [];			
		}
	}

	function connectC(v)
	{
		v.index = 1;
		stack.push(v);

		var len = list[v.ID].length;
		for (var i = 0; i < len; ++i) {
			var w = vertex[list[v.ID][i].next];
			if (w.index == undefined) {
				connectC(w);
			}
		}
	}
	return connected;
}*/