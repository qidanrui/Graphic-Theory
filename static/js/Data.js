var edge = [{"node1": 0, "node2": 1, "weight": 7},
			{"node1": 0, "node2": 3, "weight": 5},
			{"node1": 1, "node2": 2, "weight": 8},
			{"node1": 1, "node2": 3, "weight": 9},
			{"node1": 1, "node2": 4, "weight": 7},
			{"node1": 2, "node2": 4, "weight": 5},
			{"node1": 3, "node2": 4, "weight": 15},
			{"node1": 3, "node2": 5, "weight": 6},
			{"node1": 4, "node2": 5, "weight": 8},
			{"node1": 4, "node2": 6, "weight": 9},
			{"node1": 5, "node2": 6, "weight": 11}];

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
var numOfEdge = edge.length;

for (var i = 0; i < numOfVertex; ++i) {
	undirectedGraph[vertex[i].ID] = [];
	directedGraph[vertex[i].ID] = [];
}

for (var i = 0; i < numOfEdge; ++i) {
	undirectedGraph[edge[i].node1].push({"ID": edge[i].node1, "next": edge[i].node2, "weight": edge[i].weight});
	undirectedGraph[edge[i].node2].push({"ID": edge[i].node2, "next": edge[i].node1, "weight": edge[i].weight});
}

for (var i = 0; i < numOfEdge; ++i) {
	directedGraph[edge[i].node1].push({"ID": edge[i].node1, "next": edge[i].node2, "weight": edge[i].weight});
}

function ThresholdList(t)
{
	var list = {};
	for (var i = 0; i < numOfVertex; ++i) {
		list[vertex[i].ID] = [];
	}

	for (var i = 0; i < numOfEdge; ++i) {
		if (edge[i].weight > t) {
			list[edge[i].node1].push({"ID": edge[i].node1, "next": edge[i].node2, "weight": edge[i].weight});
		}
	}
	return list;
}