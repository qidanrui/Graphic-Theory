function DijkstraAlgorithm(list, start, end)
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
		console.log(now);
		var numOfSuccessor = list[now].length;
		for(var i = 0; i < numOfSuccessor; ++i) {
			if(!used[list[now][i].next]){
				queue.addNode({"value":list[now][i].value + path[now].value, "ID":list[now][i].ID, "IDOfLink":list[now][i].IDOfLink, "next":list[now][i].next});
			}			
		}
		if (queue.isEmpty()) {
			break;
		}
		var smallest = queue.popNode();
		while (!queue.isEmpty() && used[smallest.ID] && used[smallest.next]) {
			smallest = queue.popNode();
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
			if (!used[list[now][i].next]) {
				queue.addNode(list[now][i]);
			}		
		}
		if (queue.isEmpty()) {
			break;
		}
		var smallest = queue.popNode();
		while (!queue.isEmpty() && used[smallest.ID] && used[smallest.next]) {
			smallest = queue.popNode();
		}
		if (used[smallest.ID] && used[smallest.next]){
			continue;
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

function KruskalMST(links, start){
	var have_node = {};
	var id_equal = {};
	var edge = [[]];
	var return_edge = [];
	var len_of_links = links.length;
	var tree_id = 1;

	have_node[start.name] = 0;
	id_equal[0] = 0;

	for (var i = 0; i < len_of_links; ++i){
		if (have_node[links[i].source.name] == undefined && have_node[links[i].target.name] != undefined){
			have_node[links[i].source.name] = have_node[links[i].target.name];
			edge[have_node[links[i].target.name]].push(links[i].id);
		}
		else if(have_node[links[i].source.name] != undefined && have_node[links[i].target.name] == undefined){
			have_node[links[i].target.name] = have_node[links[i].source.name];
			edge[have_node[links[i].source.name]].push(links[i].id);
		}
		else if(have_node[links[i].source.name] == undefined && have_node[links[i].target.name] == undefined) {
			have_node[links[i].target.name] = tree_id;
			have_node[links[i].source.name] = tree_id;
			edge.push([links[i].id]);
			id_equal[tree_id] = tree_id;
			tree_id ++;
		}
		else{
			if(id_equal[have_node[links[i].source.name]] > id_equal[have_node[links[i].target.name]]){
				id_equal[have_node[links[i].source.name]] = id_equal[have_node[links[i].target.name]];
				edge[id_equal[have_node[links[i].target.name]]].push(links[i].id);
			}
			else if (id_equal[have_node[links[i].source.name]] < id_equal[have_node[links[i].target.name]]){
				id_equal[have_node[links[i].target.name]] = id_equal[have_node[links[i].source.name]];
				edge[id_equal[have_node[links[i].source.name]]].push(links[i].id);
			}
		}
	}
	for (var i = 0; i < tree_id; ++i){
		id_equal[i] = id_equal[id_equal[i]];
	}
	var len_of_id_equal;
	for (var i = 0; i < tree_id; ++i){
		if (id_equal[i] == 0){
			len_of_id_equal = edge[i].length;
			for (var j = 0; j < len_of_id_equal; ++j){
				return_edge.push(edge[i][j]);
			}
		}
	}
	return return_edge;
}

function FloydAlgorithm(list, node_info, links){
	var arr = {};
	var numOfVertex = node_info.length;
	var numOfLink = links.length;
	var pre = {};

	for (var i = 0; i < numOfVertex; ++i) {
		arr[i] = [];
		pre[i] = [];
		for (var j = 0; j < numOfVertex; ++j) {
			arr[i].push(100000);
			pre[i].push(-1);
		}
	}
	for (var i = 0; i < numOfLink; ++i) {
		var m = links[i].source.name;
		var n = links[i].target.name;
		var w = links[i].value;
		arr[m][n] = arr[n][m] = w;
		pre[m][n] = m;
		pre[n][m] = n;
	}
	for (var i = 0; i < numOfVertex; ++i) {
		arr[i][i] = 0;
		pre[i][i] = i;
	}
	for (var k = 0; k < numOfVertex; ++k)
		for (var i = 0; i < numOfVertex; ++i)
			for (var j = 0; j < numOfVertex; ++j) {
				if (arr[i][j] > arr[i][k] + arr[k][j]) {
					arr[i][j] = arr[i][k] + arr[k][j];
					pre[i][j] = k;
				}
			}
	var temp1;
	for (var k = 0; k < numOfVertex; ++k)
		for (var i = 0; i < numOfVertex; ++i){
			temp1 = k;
			if(pre[temp1][i] != -1){
				while(pre[temp1][i] != temp1){
					temp1 = pre[temp1][i];
				}
				pre[k][i] = temp1;
			}
		}	
	return pre;
}

function FordAlgorithm(list, start){
	var len_of_list = Object.keys(list).length;
	var pre = [];
	var path_len = [];
	var new_expand_node = [];
	for (var i = 0; i < len_of_list; ++i){
		pre[i] = 100000;
		path_len[i] = 100000;
	}
	pre[start] = -1;
	path_len[start] = 0;
	new_expand_node = [start];
	var cur_node;
	var len_of_current_next;
	while(new_expand_node.length > 0){
		cur_node = new_expand_node.shift();
		len_of_current_next = list[cur_node].length;
		for (var i = 0; i < len_of_current_next; ++i){
			if (path_len[list[cur_node][i].next] > path_len[cur_node] + list[cur_node][i].value){
				path_len[list[cur_node][i].next] = path_len[cur_node] + list[cur_node][i].value;
				pre[list[cur_node][i].next] = cur_node;
				new_expand_node.push(list[cur_node][i].next);
			}
		}
	}
	return pre;
}

function FlowAlgorithm(list, start){
	var len_of_list = Object.keys(list).length;
	var pre = [];
	var path_len = [];
	var new_expand_node = [];
	for (var i = 0; i < len_of_list; ++i){
		pre[i] = 100000;
		path_len[i] = 100000;
	}
	pre[start] = -1;
	path_len[start] = 0;
	new_expand_node = [start];
	var cur_node;
	var len_of_current_next;
	while(new_expand_node.length > 0){
		cur_node = new_expand_node.shift();
		len_of_current_next = list[cur_node].length;
		for (var i = 0; i < len_of_current_next; ++i){
			if (path_len[list[cur_node][i].next] > path_len[cur_node] + list[cur_node][i].value){
				path_len[list[cur_node][i].next] = path_len[cur_node] + list[cur_node][i].value;
				pre[list[cur_node][i].next] = cur_node;
				new_expand_node.push(list[cur_node][i].next);
			}
		}
	}
	return [pre, path_len];
}

/*function KruskalMST(links, node_info)
{
	var have_node = {};
	var edge = [];
	var tree_id = 0;
	for (val in links){
		if (have_node[val.source.name] == undefined && have_node[val.target.name] == undefined){
			have_node[val.source.name] = tree_id;
			have_node[val.target.name] = tree_id;
			tree_id ++;
			edge.push([val.IDOfLink]);
		}
		else if (have_node[val.source.name] == undefined || have_node[val.target.name] == undefined){
			if (have_node[val.source.name] == undefined){
				have_node[val.source.name] = have_node[val.target.name];
				edge[have_node[val.source.name]].push([val.IDOfLink]);
			}
			else{
				have_node[val.target.name] = have_node[val.source.name];
				edge[have_node[val.source.name]].push([val.IDOfLink]);
			}
		}
	}
	return edge;
}*/

function pointCloseness1(list, node_info, links)
{
	var arr = {};
	var numOfVertex = node_info.length;
	var numOfLink = links.length;
	for (var i = 0; i < numOfVertex; ++i) {
		arr[i] = [];
		for (var j = 0; j < numOfVertex; ++j) {
			arr[i].push(100000);
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

	var max_distance = 0;
	for (var i = 0; i < numOfVertex; ++i)
		for (var j = 0; j < numOfVertex; ++j) {
			if (arr[i][j] > max_distance && arr[i][j] < 100000){
				max_distance = arr[i][j];
			}
		}

	var max_num = 0;
	var total = [];
	var temp = 0;
	for (var i = 0; i < numOfVertex; ++i) {
		for (var j = 0; j < numOfVertex; ++j) {
			if (arr[i][j] < 100000){
				temp += arr[i][j];
			}
			else{
				temp += max_distance * 2;
			}
		}
		total.push(temp);
		if (max_num < temp){
			max_num = temp;
		}
		temp = 0;
	}
	for (var i = 0; i < numOfVertex; ++i) {
		if(total[i] >= 100000){
			total[i] = 1.0
		}
		else{
			total[i] /= max_num;	
		}
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
		betweeness[i] = Math.pow(betweeness[i] / maxValue, 1.0 / 3.0);
	}
	return betweeness;
}

function connectedComponent1(list, node_info, this_node) {

	var need_node = {};
	var numOfVertex = node_info.length;
	var component_id = 0;

	for (var i = 0; i < numOfVertex; ++i) {
		node_info[i]["index"] = undefined;
	}
	
	function connectC(v)
	{
		v.index = 1;
		need_node[v.id] = component_id;
		var len = list[v.id].length;
		for (var i = 0; i < len; ++i) {
			var w = node_info[list[v.id][i].next];
			if (w.index == undefined) {
				connectC(w);
			}
		}
	}
	
	for (var i = 0; i < numOfVertex; ++i) {
		if (node_info[i]["index"] == undefined) {
			connectC(node_info[i]);
			component_id ++;
		}
	}
	return need_node;
}

// T为迭代次数, r为分区阈值, 取T=20, r=0.5, 根据效果可以改变
function SLPA(list, node_info, T, r) {
	numOfNode = node_info.length;
	for (var i = 0; i < numOfNode; ++i) {
	    node_info[i]["memory"] = [];
	    for (var j = 0; j < numOfNode; ++j) {
	        if (j == i) {
	            node_info[i]["memory"][j] = { "id": j, "times": 1 };
	        }
	        else {
	            node_info[i]["memory"][j] = { "id": j, "times": 0 };
	        }
	    }
	}
    for (var i = 0; i < T; ++i) {
        node_info = Listen(list, node_info);
    }

    return PostProcessing(node_info, r);
}

function Listen(list, node_info) {
    var num_of_node = node_info.length;
    for (var i = 0; i < num_of_node; ++i) {
        var num_of_speaker = list[i].length;    // i结点的后继个数
        var receive_list = [];      // 用于存储从Speak函数返回的pair, 形式为{"id": ,"times": }
        for (var j = 0; j < num_of_node; ++j) {
            receive_list[j] = { "id": j, "times": 0 };
        } // init
        for (var j = 0; j < num_of_speaker; ++j) {
            var id = list[i][j]["next"];     //获取i结点的邻接点的id
            Speak(receive_list, node_info[id]["memory"]);
        }
        var length_of_receive_list = receive_list.length;
        var most_popular_id = -1;
        var most_popular_times = 0;
        for (var j = 0; j < length_of_receive_list; ++j) {
            if (receive_list[j]["times"] > most_popular_times) {
                most_popular_id = receive_list[j]["id"];
                most_popular_times = receive_list[j]["times"];
            }
        } // 获取最受欢迎的结点id
        if (most_popular_id != -1) {
            ++node_info[i]["memory"][most_popular_id].times;       // 增加最受欢迎的结点的id出现次数
        }
    } // 对邻接表的每一个结点进行处理
    return node_info;
}

function Speak(receive_list, memory) {
    var num_of_node = memory.length;
    var choose_list = [];   // 用于随机时选择的list
    for (var i = 0; i < num_of_node; ++i) {
        for (var j = 0; j < memory[i].times; ++j) {
            choose_list.push(i);    // choose_list中存放的是待选择点的id
        }
    }
    var choose = Math.random() * choose_list.length;
    var result_id = choose_list[Math.floor(choose)];
    ++receive_list[result_id].times;
}

function PostProcessing(node_info, r) {
    var num_of_node = node_info.length;
    var pre_result = [];
    for (var i = 0; i < num_of_node; ++i) {
        Process(node_info[i]["memory"], r);
        node_info[i]["community"] = [];
        for (var j = 0; j < num_of_node; ++j) {
            if (node_info[i]["memory"][j].times != 0) {
                if (pre_result[j] == undefined) {
                    pre_result[j] = [i];
                }
                else {
                    pre_result[j].push(i);
                }
            }
        }
    }

    var result = [];
    for (var i = 0; i < num_of_node; ++i) {
        if (pre_result[i] != undefined && pre_result[i].length > 1) {
            result.push(pre_result[i]);
        }
    }
    return result;
}

function Process(memory, r) {
    var sum = 0;
    var length = memory.length;
    for (var i = 0; i < length; ++i) {
        sum += memory[i].times;
    }
    var threshold = r * sum;
    for (var i = 0; i < length; ++i) {
        if (memory[i].times < threshold) {
            memory[i].times = 0;
        }
    }
}
