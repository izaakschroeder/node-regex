
var 
	util = require('util'),
	EventEmitter = require('events').EventEmitter;

/**
 *
 *
 *
 */
function Lexer() {
	EventEmitter.call(this);
	this.state = 0;
	this.position = 0;
	this.last = 0;
	this.buffer = "";
}

util.inherits(Lexer, EventEmitter);

/**
 *
 *
 *
 */
Lexer.tokenCharacters = {
	'[': "startClass",
	']': "endClass",
	'(': "startGroup",
	')': "endGroup",
	'{': "startMultiplicity",
	'}': "endMultiplicity",
	'^': "startOfInput",
	'$': "endOfInput",
	'|': "or",
	'*': "kleeneStar",
	'+': "kleenePlus",
	'.': "any",
	'?': "optional"
}

/**
 *
 *
 *
 */
Lexer.magicCharacters = {
	'n': '\n',
	't': '\t',
	'\\': '\\'
}

/**
 *
 *
 *
 */
Lexer.prototype.write = function(data) {
	var character;
	
	this.buffer += data;
		
	while(this.position < this.buffer.length)
	{
		switch(this.state) 
		{
		case 0: //in normal state
			
			character = this.buffer[this.position];
			
			if (character in Lexer.tokenCharacters)
			{
				++this.position;
				if (character === '[') {
					this.state = 2;
					this.last = this.position;
				}
				else if (character === '{') {
					this.state = 3;
					this.last = this.position;
				}
				this.emit("data", {token: Lexer.tokenCharacters[character], data: character});
			}
			else if (character == "\\")
			{
				this.state = 1;
				++this.position;
			}
			else
			{
				++this.position;
				this.emit("data", { token: "character", data: character});
			}
			break;
			
		case 1: //in the "\" state
			character = this.buffer[this.position++]; //Read a character
			 //Is it magical?
			if (character in Lexer.magicCharacters) {
				this.state = 0; //We are done!
				this.emit("data", { token: "character", data: Lexer.magicCharacters[character]}); //Pass up the token
			}
			 //Are they escaping a token?
			else if (character in Lexer.tokenCharacters) {
				this.state = 0; //We are done!
				this.emit("data", {token: "character", data: character}); //Pass up the token
			}
			//The user has inputed some escape sequence that we evidently cannot handle
			else {
				this.emit("error");
			}
			break;
			
		case 2:
			character = this.buffer[this.position];
			if (character == ']') {
				this.state = 0;
				this.emit("data", {token: "string", data: this.buffer.substring(this.last, this.position)});
			}
			else {
				this.position++;
			}
			break;
		case 3:
			character = this.buffer[this.position];
			if (character == '}') {
				this.state = 0;
				this.emit("data", {token: "string", data: this.buffer.substring(this.last, this.position)});
			}
			else {
				this.position++;
			}
			break;
			
		}
	}	
}

/**
 *
 *
 *
 */
Lexer.prototype.end = function() {
	if (this.state != 0)
		this.emit("error");
	else
		this.emit("end");
}

module.exports = Lexer;
