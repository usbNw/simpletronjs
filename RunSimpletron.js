var memory = [];
var instructionCounter = 0;
var instructionRegistor = 0;
var operationCode = 0;
var operand = 0;
var accumulator = 0;
var testnum;
var location;
var nextCounter = 0;
var halted = false;

for(var i = 0; i < 100; i++) {
    memory.push(pad(0, 4));
}
var btnExec = document.getElementById('btn-exec');
var btnClear = document.getElementById('btn-clear');
var btnStart = document.getElementById('btn-start');
var code = document.querySelector('#code textarea');
var output = document.querySelector('#output textarea');
var mem = document.querySelector('#mem textarea');


function Testmemory() {
	do {
		testnum = parseInt(prompt('메모리 위치 '+pad(instructionCounter, 4)));
		memory[instructionCounter ++] = testnum;
	}while(testnum != -99999);
	memory[instructionCounter - 1] = 0;
	outputWrite('*** Program loading completed *** ');
	outputWrite('*** Program excution begins ***');

	for(var i = 0; i< instructionCounter - 1; i++) {
		codeWrite(memory[i]);
	}	
}

function ProgramExcution() {
	
	instructionCounter = nextCounter;
	if(instructionCounter == (memory.length) - 1) {
		halt();
	}
		instructionRegistor = ~~(memory[nextCounter]);
		operationCode = ~~(instructionRegistor / 100);
		operand = instructionRegistor % 100;
		
		nextCounter = instructionCounter + 1;

		switch(operationCode) {
			case Instructioncode.READ:
				read();
				//memory[operand] = parseInt(prompt('숫자를 입력하세요'));
				break;
		
			case Instructioncode.WRITE:
				outputWrite('OUTPUT : '+memory[operand]);
				break;
			
			case Instructioncode.LOAD:
				accumulator = memory[operand];
				break;
			
			case Instructioncode.STORE:
				memory[operand] = accumulator;
				break;
			
			case Instructioncode.ADD:
				accumulator += memory[operand];
				break;
			
			case Instructioncode.SUBTRACT:
				accumulator -= memory[operand];
				break;
				
			case Instructioncode.MULTIPLY:
				accumulator *= memory[operand];
				break;
				
			case Instructioncode.DIVIDE:
				accumulator /= memory[operand];
				
				if(memory[operand] === 0) {
					outputWrite('*** Attempt to divide by zero ***');
				}
				break;
				
			case Instructioncode.BRANCH:
				nextCounter = operand;
				break;
				
			case Instructioncode.BRANCHNEG:
				if(accumulator < 0) 
					nextCounter = operand;	
				break;
				
			case Instructioncode.BRANCHZERO:
				if(accumulator === 0) 
					nextCounter = operand;
				break;
				
			case Instructioncode.HALT:
				halt();
				break;
				
			default :
				outputWrite('ERROR');
				halt();
				break;				
		}
}

function read() {
	memory[operand] = parseInt(prompt('숫자를 입력하세요'));	
	if(memory[operand] < Instructioncode.OVERFLOW_MIN || memory[operand] > Instructioncode.OVERFLOW_MAX) {
		outputWrite('*** OVERFLOW ***');
	}
}

function halt() {
	outputWrite('*** Simpletron excution terminated ***');
	Memwrite('ACCUMULATOR :\t\t +'+pad(accumulator, 4)+ '\n');
	Memwrite('INSTRUCTIONCOUNTER : \t +' +instructionCounter+ '\n');
	Memwrite('INSTRUCTIONREGISTOR :\t +'+pad(instructionRegistor, 4)+ '\n');
	Memwrite('OPCODE : \t\t +' +operationCode+ '\n');
	Memwrite('OPERAND : \t\t +' +pad(operand, 2)+ '\n');
	Memwrite(Printdump());
	halted = true;
}


function pad(n, width) {
	  n = n + '';
	  return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

function codeWrite(num) {
	code.value += num + '\n';
	 code.scrollTop = code.scrollHeight;
}

function outputWrite(val) {
	output.value += val + '\n'
}


function codeClear() {
	code.value = '';
	output.value = '';
	mem.value = '';
}

function acc_checker() {
	if(accumulator < Instrucioncode.OVERFLOW_MIN || accumulator > Instrucioncode.OVERFLOW_MAX) {
		outputWrite('*** OVERFLOW ***');
	}
	
}

function Printdump() {
	var test = '';

	for(var i = 0; i < 10; i++) {
		test += '\t    '+i +' ';
	}

	test += '\n';

	for(var j = 0; j < 10; j++) {
		test += '  ' + (j * 10);

		for(var k = 0; k < 10; k++) {
			test += '     +' + pad(memory[10 * j + k], 4);
		}
		test += '\n'
	}
	return test;
}

function Memwrite(reg) {
	mem.value += reg;
}

btnExec.addEventListener('click', function() {
	Testmemory();
	
	var lines = code.value.split('\n');
	memory.forEach(function(value, index) {
		if(index < lines.length) {
			memory[index] = ~~lines[index];
		} else {
			memory[index] = 0;
		}
	});

});

btnClear.addEventListener('click', function() {
	codeClear();
});

btnStart.addEventListener('click', function() {
	halted = false;
    nextCounter = 0;
	accumulator = 0;

	outputWrite('*** Simplestron Start ***');
    while(!halted) {
		ProgramExcution();
	}
});

