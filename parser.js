
var 
	ParseKit = require('parsekit'), 
	util = require('util');

var grammar = new ParseKit.Grammar({
	tokens: [
		"startClass",
		"endClass",
		"startGroup",
		"endGroup",
		"startMultiplicity",
		"endMultiplicity",
		"startOfInput",
		"endOfInput",
		"or",
		"kleeneStar",
		"kleenePlus",
		"any",
		"optional",
		"character",
		"string"
	],
	rules: {
		"expression": {
			"orExpression": { //0
				rule: [ "expression", "or", "expression" ],
				associativity: "left",
				dominates: [  ]
			},
			"kleeneStarExpression": { //1
				rule: [ "expression", "kleeneStar" ],
				dominates: ["concatenatedExpression", "orExpression"]
			},
			"kleenePlusExpression": { //2
				rule: [ "expression", "kleenePlus" ],
				dominates: ["concatenatedExpression", "orExpression"]
			},
			"optionalExpression": { //3
				rule: [ "expression", "optional" ],
				dominates: ["concatenatedExpression", "orExpression"]
			},
			"anyExpression": { //4
				rule: [ "any" ],
				dominates: [ "concatenatedExpression", "orExpression" ]
			},
			"classExpression": { //5
				rule: [ "startClass", "string", "endClass" ],
				dominates: [ "orExpression", "concatenatedExpression" ]
			},
			"concatenatedExpression": { //6
				rule: [ "expression", "expression" ],
				associativity: "left",
				dominates: [ "multiplicityExpression", "orExpression" ]
			},
			"characterExpression": { //7
				rule: [ "character" ],
				dominates: [ "concatenatedExpression", "orExpression" ]
			},
			"startOfInputExpression": { //8
				rule: [ "startOfInput" ],
				dominates: [ "concatenatedExpression", "orExpression" ]
			},
			"endOfInputExpression": { //9
				rule: [ "endOfInput" ],
				dominates: [ "concatenatedExpression", "orExpression" ]
			},
			"groupExpression": { //10
				rule: [ "startGroup", "expression", "endGroup" ],
				dominates: [ "concatenatedExpression", "orExpression" ]
			},
			"multiplicityExpression": { //11
				rule: [ "expression", "startMultiplicity", "string", "endMultiplicity" ],
				dominates: [ "concatenatedExpression", "orExpression" ]
			}

		}
	},
	start: "expression"
})


function Parser() {
	ParseKit.Parser.call(this, grammar);
}

util.inherits(Parser, ParseKit.Parser);

module.exports = Parser;
