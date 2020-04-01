// constructor
function Calculator(tableid) {
	this.expression = [];
	this.undoops = [];
	this.bdecimal = false;
	this.precedence = {"+":1, "-":1, "*":2, "/":2};
	this.table = document.getElementById(tableid)
	this.input = document.getElementById("input");
	this.result = document.getElementById("result");
	const digits = document.getElementsByClassName("digit")
	const operations = document.getElementsByClassName("operation");
	
	for (let digit of digits) 
		digit.addEventListener('click', this.handleDigit.bind(this));
	for (let operation of operations) 
		operation.addEventListener('click', this.handleOperation.bind(this));
	
	document.getElementById("equal").addEventListener('click', this.handleEqual.bind(this));
	document.getElementById("enter").addEventListener('click', this.handleEnter.bind(this));
	document.getElementById("undo").addEventListener('click', this.handleUndo.bind(this));
	document.getElementById("clear").addEventListener('click', this.handleClear.bind(this));
	document.getElementById("decimal").addEventListener('click', this.handleDecimal.bind(this));
}

// member methods
Calculator.prototype = {
	handleDigit: function(event) {
		let e = this.expression;
		if(e.length > 0 && !isNaN(e[e.length-1])) // append decimal if it's a digit	
			e[e.length-1] += event.target.innerHTML;
		else e.push(event.target.innerHTML);
		input.innerHTML = e.join(" ");
	},

	handleOperation: function(event) {
		let e = this.expression;
		if(e.length == 0 || this.isOperator(e[e.length-1]))
			return;
		this.bdecimal = false;
		e.push(event.target.innerHTML);
		this.input.innerHTML = e.join(" ");
	},

	handleClear: function(event) {
		let e = this.expression;
		if(e.length == 0)
			return;
		this.undoops.push([e.pop(), this.bdecimal]);
		this.bdecimal = (e.length > 0) ? this.hasDecimal(e[e.length-1]) : false;	
		this.input.innerHTML = this.expression.join(" ");
		return;
	},

	handleUndo: function(event) {
		if(this.undoops.length > 0) {
			let undo = this.undoops.pop()
			this.expression.push(undo[0]);
			this.bdecimal = undo[1];
		}
		input.innerHTML = this.expression.join(" ");
	},

	handleDecimal: function(event) {
		let e = this.expression;
		if(e.length == 0) {
			e.push("0.");
			this.bdecimal = true;
		}
		else if(!this.bdecimal) {
			if(!isNaN(e[e.length-1])) { // append decimal if it's a digit
				e[e.length-1] += ".";
				this.bdecimal = true;
			}
		}
		this.input.innerHTML = e.join(" ");
	},

	handleEnter: function(event) {
		let res = this.infix2PostfixExpression(this.expression);	
		res = this.evaluatePostfixExpression(res);
		this.result.innerHTML = res;
	},
	
	handleEqual: function(event) {
		this.handleEnter(event);
		this.reset();
	},
	
	reset: function() {
		this.input.innerHTML = "";
		this.bdecimal = false;
		this.undoops = [];
		this.expression = [];
	},

	isOperator: function(token) { return ["+","-","/","*"].indexOf(token) > -1 },

	hasHigherPrec: function(op1, op2) { return this.precedence[op1] >= this.precedence[op2]; },
	
	hasDecimal: function(token) { return token.indexOf("."); },

	infix2PostfixExpression: function(infixexp) {
		var stack = [];
		var postfixexp = [];
		for(var i=0; i<infixexp.length; i++) {
			var token = infixexp[i];
			if(this.isOperator(token)) {
				while(stack.length !== 0 && this.hasHigherPrec(stack[stack.length-1],token))
					postfixexp.push(stack.pop());
				stack.push(token);		
			} // end if
			else postfixexp.push(token);
		}
		while(stack.length !== 0)
			postfixexp.push(stack.pop());
		return postfixexp;
	},

	evaluatePostfixExpression: function(postfixexp) {
		var stack = [];
		
		console.log(postfixexp);
		
		for(let token of postfixexp) {
			if(this.isOperator(token.trim())) {
				let op2 = stack.pop();
				let op1 = stack.pop();
				stack.push(this.eval(token,parseFloat(op1),parseFloat(op2)))
			}
			else {
				stack.push(token);
			}
		}
		
		console.log(stack);
		
		return stack[stack.length-1]
	},

	eval: function(operation, operand1, operand2) {
		switch(operation) {
			case '+': 
				return operand1 + operand2;
			case '-': 
				return operand1 - operand2;
			case '/': 
				return operand1 / operand2;
			case '*': 
				return operand1 * operand2;
		}
	}
}

new Calculator("calculator");
