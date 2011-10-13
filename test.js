
var 
	RegularExpression = require('regex'),
	assert = require('assert');


function matchesBasic() {
	var r = RegularExpression.fromString("xyz");
	assert.ok(r.test("xyz"));
	assert.ok(!r.test("xy"));
}

function matchesRangeBasic() {
	var r = RegularExpression.fromString("[A-Z]");
	assert.ok(!r.test("x"));
	assert.ok(r.test("A"));
}

function matchesRangeComplex() {
	var r = RegularExpression.fromString("[A-Za-z0-9_-]");
	assert.ok(r.test("-"));
	assert.ok(r.test("_"));
	assert.ok(r.test("4"));
	assert.ok(r.test("A"));
	assert.ok(r.test("x"));
}

function matchesRangeInverted() {
	var r = RegularExpression.fromString("[^abc]");
	assert.ok(r.test("A"));
	assert.ok(r.test("d"));
	assert.ok(r.test("e"));
	assert.ok(!r.test("a"));
	assert.ok(!r.test("b"));
	assert.ok(!r.test("c"));
}

function matchesRangeInvertedComplex() {
	var r = RegularExpression.fromString("[^A-Z0-9_]+");
	assert.ok(!r.test(""));
	assert.ok(r.test("abc"));
	assert.ok(r.test("def"));
	assert.ok(r.test("xyz"));
	assert.ok(!r.test("4"));
	assert.ok(!r.test("AbcE9"));
	assert.ok(!r.test("_"));
}

function matchesRangeCharacterClass() {
	//TODO: Implement me!
	//RegularExpression r = RegularExpression.fromString("[:latin:]+");
	//assert.ok(r.test("reTEfgb"));
}


function matchesOptionalBasic() {
	var r = RegularExpression.fromString("a?");
	assert.ok(r.test(""));
	assert.ok(r.test("a"));
	assert.ok(!r.test("aa"));
}

function matchesOptionalAdvanced() {
	var r = RegularExpression.fromString("abc?(abc)?");
	assert.ok(!r.test(""));
	assert.ok(r.test("ab"));
	assert.ok(r.test("abc"));
	assert.ok(r.test("abcabc"));
	assert.ok(!r.test("abca"));
	assert.ok(!r.test("abcab"));
}

function matchesKleenePlusBasic() {
	var r = RegularExpression.fromString("a+");
	assert.ok(!r.test(""));
	assert.ok(r.test("a"));
	assert.ok(r.test("aa"));
	assert.ok(r.test("aaaaaaaaaaaaaaa"));
}

function matchesKleenePlusAdvanced() {
	var r = RegularExpression.fromString("abc+(abc)+");
	assert.ok(!r.test(""));
	assert.ok(!r.test("ab"));
	assert.ok(!r.test("abc"));
	assert.ok(r.test("abcccccccabc"));
	assert.ok(r.test("abcabcabcabc"));
	assert.ok(r.test("abcccabcabcabc"));
}

function matchesKleeneStarBasic() {
	var r = RegularExpression.fromString("a*");
	assert.ok(r.test(""));
	assert.ok(r.test("a"));
	assert.ok(r.test("aa"));
	assert.ok(r.test("aaaaaaaaaaaaaaa"));
}

function matchesKleeneStarAdvanced() {
	var r = RegularExpression.fromString("abc*(abc)*");
	assert.ok(!r.test(""));
	assert.ok(r.test("ab"));
	assert.ok(r.test("abc"));
	assert.ok(r.test("abcccccccabc"));
	assert.ok(r.test("abcabcabcabc"));
	assert.ok(r.test("abcccabcabcabc"));
}

function matchesDisjunctionBasic() {
	var r = RegularExpression.fromString("a|b|c");
	assert.ok(!r.test(""));
	assert.ok(r.test("a"));
	assert.ok(r.test("b"));
	assert.ok(r.test("c"));
	assert.ok(!r.test("ab"));
	assert.ok(!r.test("ac"));
	assert.ok(!r.test("abc"));
}

function matchesDisjunctionNonDeterministic() {
	var r = RegularExpression.fromString("ab|af|ab|ac|ad|ae", true);
	assert.ok(!r.test(""));
	assert.ok(r.test("ab"));
	assert.ok(r.test("ac"));
	assert.ok(r.test("ad"));
	assert.ok(r.test("ae"));
	assert.ok(r.test("af"));
	
}

function matchesDisjunctionRangeNonDeterministic() {
	var r = RegularExpression.fromString("[A-X]|[X-Z]|[B-Q]|R|S");
	assert.ok(!r.test(""));
	assert.ok(r.test("A"));
	assert.ok(r.test("S"));
	assert.ok(r.test("Q"));
	
}

function matchesDisjunctionAdvanced() {
	var r = RegularExpression.fromString("(abc?)|def|gh*i|abf");
	assert.ok(!r.test(""));
	assert.ok(r.test("ab"));
	assert.ok(r.test("abc"));
	assert.ok(r.test("abf"));
	assert.ok(r.test("def"));
	assert.ok(r.test("gi"));
	assert.ok(r.test("ghi"));
	assert.ok(r.test("ghhhhi"));
}

function matchesAnyCharacterBasic() {
	var r = RegularExpression.fromString(".");
	assert.ok(r.test("e"));
	assert.ok(r.test("F"));
	assert.ok(r.test("9"));
}

function matchesAnyCharacterKleeneStar() {
	var r = RegularExpression.fromString(".*");
	assert.ok(r.test(""));
	assert.ok(r.test("Fsdf"));
	assert.ok(r.test("9$#re"));
}

function matchesAnyCharacterKleenePlus() {
	var r = RegularExpression.fromString(".+");
	assert.ok(!r.test(""));
	assert.ok(r.test("45fdGHr6%$"));
	assert.ok(r.test("^&*gfh"));
}

function matchesAnyCharacterAdvanced() {
	var r = RegularExpression.fromString(".*abc");
	assert.ok(r.test("abc"));
	assert.ok(r.test("F4rrgfER3abc"));
	assert.ok(!r.test("r4FWab"));
}

function stringTest() {
	var r = RegularExpression.fromString("\"([^\\\"\\\\]|\\\\([\"bfnrt]|u[0-9]{4}))*\"");
	assert.ok(r.test("\"derp\""));
	assert.ok(r.test("\"derp\\\"chong\""));
}


matchesBasic();
matchesRangeBasic();
matchesRangeComplex();
matchesOptionalBasic();
matchesOptionalAdvanced(); 
matchesKleenePlusBasic();
matchesKleenePlusAdvanced();
matchesKleeneStarBasic();
matchesKleeneStarAdvanced();
matchesDisjunctionBasic();
matchesDisjunctionNonDeterministic();
matchesDisjunctionRangeNonDeterministic();
matchesDisjunctionAdvanced();
matchesAnyCharacterBasic();
matchesAnyCharacterKleeneStar();
matchesAnyCharacterKleenePlus();
matchesAnyCharacterAdvanced();
stringTest();
