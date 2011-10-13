
var
	util = require('util'),
	factory = require('fsm/types/unicode.js'),
	FiniteStateMachine = require('fsm'),
	Lexer = require('./lexer'),
	Parser = require('./parser');

/**
 *
 *
 *
 */
function RegularExpression(machine) {
	this.machine = machine.determinize();
}

/**
 *
 *
 *
 */
RegularExpression.anyCharacter = function() {
	var m = new FiniteStateMachine();
	var start = m.createState(), end = m.createState(true);
	m.transition(start, end, factory.anything());
	return new RegularExpression(m);
}

/**
 *
 *
 *
 */
RegularExpression.characterClass = function(name) {
	
}

/**
 *
 *
 *
 */
RegularExpression.characterRange = function(characters) {
	var 
		last = null,
		wantRange = false,
		invert = false,
		m = new FiniteStateMachine(),
		transitions = [ ],
		start = m.createState(),
		end = m.createState(true),
		i = 0;
	
	if (invert = (characters[0] === '^'))
		i = 1;
	
	for(; i<characters.length; ++i) {
		var c = characters.charAt(i);
		if (wantRange) {
			transitions.push(factory.transition(last, c));
			last = null;
			wantRange = false;
		} 
		else if (last != null && c === '-') {
			wantRange = true;
		} 
		else {
			if (last != null)
				transitions.push(factory.transition(last));
			last = c;
		}
	}
	
	if (last != null)
		transitions.push(factory.transition(last));
	
	if (wantRange)
		transitions.push(factory.transition('-'));
	
	var transition = transitions.reduce(function(previous, current){ return previous ? previous.union(current) : current; });
	
	m.transition(start, end, invert ? transition.invert() : transition);
				
	return new RegularExpression(m);
}

/**
 *
 *
 *
 */
RegularExpression.character = function(character) {
	var m = new FiniteStateMachine();
	var start = m.createState(), end = m.createState(true);
	m.transition(start, end, factory.transition(character));
	return new RegularExpression(m);
}

/**
 *
 *
 *
 */
RegularExpression.prototype.disjunct = function(expression) {
	return new RegularExpression(this.machine.disjunct(expression.machine));
}

/**
 *
 *
 *
 */
RegularExpression.prototype.concatenate = function(expression) {
	return new RegularExpression(this.machine.concatenate(expression.machine));
}

/**
 *
 *
 *
 */
RegularExpression.prototype.kleeneStar = function() {
	return new RegularExpression(this.machine.kleeneStar());
}

/**
 *
 *
 *
 */
RegularExpression.prototype.kleenePlus = function() {
	return new RegularExpression(this.machine.kleenePlus());
}

/**
 *
 *
 *
 */
RegularExpression.prototype.optional = function() {
	return new RegularExpression(this.machine.optional());
}

/**
 *
 *
 *
 */
RegularExpression.prototype.multiplicity = function(min, max) {
	return new RegularExpression(this.machine.multiplicity(min, max));
}

/**
 *
 *
 *
 */
RegularExpression.fromString = function(string, x) {
	var 
		lexer = new Lexer(), 
		parser = new Parser(),
		result = null;
	
	lexer.on("data", function(token) {
		parser.write(token);
	});
	
	lexer.on("end", function(){
		parser.end();
	});
	
	parser.on("orExpression", function(expressionA, or, expressionB) {
		this.regularExpression = expressionA.regularExpression.disjunct(expressionB.regularExpression);
	})
	
	parser.on("kleeneStarExpression", function(expression, kleeneStar) {
		this.regularExpression = expression.regularExpression.kleeneStar();
	});
	
	parser.on("kleenePlusExpression", function(expression, kleenePlus) {
		this.regularExpression = expression.regularExpression.kleenePlus();
	});
	
	parser.on("optionalExpression", function(expression, optional) {
		this.regularExpression = expression.regularExpression.optional();
	});
	
	parser.on("anyExpression", function(any) {
		this.regularExpression = RegularExpression.anyCharacter();
	})
	
	parser.on("classExpression", function(startClass, string, endClass) {
		this.regularExpression = RegularExpression.characterRange(string.data);
	})
	
	parser.on("concatenatedExpression", function(expressionA, expressionB) {
		this.regularExpression = expressionA.regularExpression.concatenate(expressionB.regularExpression);
	});
	
	parser.on("characterExpression", function(character) {
		this.regularExpression = RegularExpression.character(character.data);
		//console.log(this.regularExpression);
	});
	
	parser.on("groupExpression", function(startGroup, expression, endGroup) {
		this.regularExpression = expression.regularExpression;
	});
	
	parser.on("multiplicityExpression", function(expression, startMultiplicity, string, endMultiplicity) {
		var parts = string.data.split(",").map(function(val){ if (val.length === 0) return -1; return parseInt(val); });
		this.regularExpression = expression.regularExpression.multiplicity(parts[0], parts[1]);
	});
	
	
	parser.on("startOfInputExpression", function(startOfInput) {
		
	});
	
	parser.on("endOfInputExpression", function(endOfInput) {
		
	});
	
	parser.on("end", function(expression) {
		result = expression.regularExpression;;
	})
	
	lexer.write(string);
	lexer.end();
	
	return result;
	
}

RegularExpression.prototype.test = function(string) {
	var context = this.machine.context();
	try {
		for (var i = 0; i < string.length; ++i)
			context.write(string[i]);
		context.end();
		return true;
	} catch(e) {
		return false;
	}
	
}

module.exports = RegularExpression;
