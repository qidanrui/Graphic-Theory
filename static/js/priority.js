function PriorityQueue(func) {
    this.compareF = func;
    this.nodeList = [];
    this.initList = function (newList) {
                        var tempNode;
                        var lengthList;
                        this.nodeList = newList;
                        var tempIndex;
        
                        lengthList = newList.length;
                        for(var i = lengthList; i >=2; i--){
                            tempIndex = Math.floor(i / 2);
                            if(this.compareF(this.nodeList[tempIndex-1], this.nodeList[i-1]) > 0){
                                tempNode = this.nodeList[tempIndex-1];
                                this.nodeList[tempIndex-1] = this.nodeList[i-1];
                                this.nodeList[i-1] = tempNode;
                            }   
                        }
                    };
    this.addRestructure = function() {
                            var tempNode;
                            var current = this.nodeList.length;
                            var parent = Math.floor(current / 2);
                            while(parent >= 1){
                                if(this.compareF(this.nodeList[parent-1], this.nodeList[current-1]) > 0){
                                    tempNode = this.nodeList[parent-1];
                                    this.nodeList[parent-1] = this.nodeList[current-1];
                                    this.nodeList[current-1] = tempNode;
                                }
                                current = parent;
                                parent = Math.floor(current / 2);
                            }
                        };

    this.addNode = function (newNode) {
                        this.nodeList.push(newNode);
                        this.addRestructure()
                    };
    this.popNode = function () {
                        var lengthList = this.nodeList.length;
                        var returnNode;
                        if(lengthList > 0){
                            returnNode = this.nodeList[0];
                            this.nodeList[0] = this.nodeList[lengthList-1];
                            this.nodeList[lengthList-1] = returnNode;
                            this.nodeList.pop();
                            this.popRestructure();
                            return returnNode;
                        }
                        else{
                            return null
                        }
                    };
    this.popRestructure = function () {
                            var tempNode;
                            var tempLength = this.nodeList.length;
                            var current = 1;
                            var child1 = current * 2;
                            var child2 = current * 2 + 1;
                            while(child1 <= tempLength){
                                if(child2 <= tempLength){
                                    if(this.compareF(this.nodeList[child2-1], this.nodeList[child1-1]) > 0){
                                        if(this.compareF(this.nodeList[current-1], this.nodeList[child1-1]) > 0){
                                            tempNode = this.nodeList[current-1];
                                            this.nodeList[current-1] = this.nodeList[child1-1];
                                            this.nodeList[child1-1] = tempNode;
                                            current = child1;
                                        }
                                        else{
                                            break;
                                        }
                                    }
                                    else{
                                        if(this.compareF(this.nodeList[current-1], this.nodeList[child2-1]) > 0){
                                            tempNode = this.nodeList[current-1];
                                            this.nodeList[current-1] = this.nodeList[child2-1];
                                            this.nodeList[child2-1] = tempNode;
                                            current = child2;
                                        }
                                        else{
                                            break;
                                        }
                                    }
                                }
                                else{
                                    if(this.compareF(this.nodeList[current-1], this.nodeList[child1-1]) > 0){
                                        tempNode = this.nodeList[current-1];
                                        this.nodeList[current-1] = this.nodeList[child1-1];
                                        this.nodeList[child1-1] = tempNode;
                                        current = child1;
                                    }
                                    else{
                                        break;
                                    }
                                }
                                child1 = current * 2;
                                child2 = current * 2 + 1;
                            }
                        };
    this.isEmpty = function () {
                            return (this.nodeList.length == 0);
                        };                  
    this.clear = function () {
                            this.nodeList = [];
                        };

}
