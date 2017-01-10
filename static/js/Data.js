var links = [{"source": 0, "target": 1, "value": 7},
			{"source": 0, "target": 3, "value": 5},
			{"source": 1, "target": 2, "value": 8},
			{"source": 1, "target": 3, "value": 9},
			{"source": 1, "target": 4, "value": 7},
			{"source": 2, "target": 4, "value": 5},
			{"source": 3, "target": 4, "value": 15},
			{"source": 3, "target": 5, "value": 6},
			{"source": 4, "target": 5, "value": 8},
			{"source": 4, "target": 6, "value": 9},
			{"source": 5, "target": 6, "value": 11}];

var vertex = [{"ID": 0},
			  {"ID": 1},
			  {"ID": 2},
			  {"ID": 3},
			  {"ID": 4},
			  {"ID": 5},
			  {"ID": 6}];

var undirectedGraph = {};
var directedGraph = {};
var numOfVertex = vertex.length;
var numOfLinks = links.length;

for (var i = 0; i < numOfVertex; ++i) {
	undirectedGraph[vertex[i].ID] = [];
	directedGraph[vertex[i].ID] = [];
}

for (var i = 0; i < numOfLinks; ++i) {
	undirectedGraph[links[i].source].push({"ID": links[i].source, "next": links[i].target, "value": links[i].value});
	undirectedGraph[links[i].target].push({"ID": links[i].target, "next": links[i].source, "value": links[i].value});
}

for (var i = 0; i < numOfLinks; ++i) {
	directedGraph[links[i].source].push({"ID": links[i].source, "next": links[i].target, "value": links[i].value});
}

function ThresholdList(t)
{
	var list = {};
	for (var i = 0; i < numOfVertex; ++i) {
		list[vertex[i].ID] = [];
	}

	for (var i = 0; i < numOfLinks; ++i) {
		if (links[i].value > t) {
			list[links[i].source].push({"ID": links[i].source, "next": links[i].target, "value": links[i].value, "IDOfLink": i});
		}
	}
	return list;
}
