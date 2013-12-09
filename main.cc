/*
Author: 		Alex Williams
Instructor: 	Pettey
Due Date:	12/9/2011
Class:		CSCI 3080 (Discrete Structures)
Assignment:	Lab 4 (Last one! Horray!)

Description: This program will pull one hamming code at a time,
check for errors, pull the Grey code out, convert to Binary, and lastly,
reference the location (withinin a list of characters) that is pulled from 
the hamming code


*/


#include <iostream>
#include <fstream>
#include <string>
using namespace std;


//Function Declarations
int transmissionCheck(int hammingArray[9]);
void gToB(int array[5], char decoder[30]);
void hToG(int grey[5], int array[9], char decoder[30]);


//Begin Main
int main()
{
	char decoded;
	char decoder[30]; 	// Array used to hold the characters for decoding.
	int hammingArray[9]={0};
	int grey[5];
	int i = 0;
	string hammingCode;
	
	//********************************************************
	//Begin File Input for the Decoder array.
	ifstream myIn;
	myIn.open("chars.dat");	// Open the File
	
	if(!myIn)
		//There should logically be a message here.
	
	myIn.ignore(1);
	
	//-----Begin Reads----
	while(!myIn.eof())	//While not End of File.
	{
	
		//Read in the Value
		myIn >> noskipws >> decoded;
		
		
		//Assign the character to the Decoder array.
		decoder[i] = decoded;
		
		//Increment I.
		i++;
	}
	
	myIn.close();
	//*********************************************************
	
	
	
	//********************************************************
	//Begin File Input for the Hamming Codes
	myIn.open("packets.dat");	// Open the File
	
	if(!myIn)
		// No Error Message
	
	myIn.ignore(1);
	
	getline(myIn, hammingCode);
	
	
	//-----Begin Reads----
	while(!myIn.eof())	//While not End of File.
	{		
		
		
		for(int r=0; r < 9; r++)
			hammingArray[r] = hammingCode[r]-48;
		
		int temp = 0;
		
		//Check for Errors
		temp = transmissionCheck(hammingArray);
		
		//cout << " TEMP IS " << temp << " ";
		
		if(temp != 0)	// Flip the bit based on the Errors found.
			hammingArray[temp-1] =(hammingArray[temp-1] +1)  % 2;
		
		
		//Convert hamming to grey
		hToG(grey, hammingArray, decoder);
		
		
		//Get the Next code
		getline(myIn, hammingCode);
		
	}
	
	cout << endl;
	
	myIn.close();
	
	//*********************************************************
	
	
	
	return 0;
	
}



//Function Definitions

/*
	Function: transmissionCheck(int [])
	Description: This function will check for errors in the parity bits
	and return the proper error value.

*/

int transmissionCheck(int hammingArray[9])
{
	//Error Key Variable.
	int errorKey = 0;
	
	//Check Position 1, 3, 5, 7, and 9.
	if((hammingArray[0] + hammingArray[2] + hammingArray[4] + hammingArray[6] + hammingArray[8])%2 == 1)
		errorKey++;
	
	//Check Position 2, 3, 6, and 7.
	if((hammingArray[1] + hammingArray[2] + hammingArray[5] + hammingArray[6])%2 == 1)
		errorKey+=2;
	
	//Check Position 4, 5, 6, and 7.
	if((hammingArray[3] + hammingArray[4] + hammingArray[5] + hammingArray[6])%2 == 1)
		errorKey+=4;
	
	//Check Position 8 and 9.
	if((hammingArray[7] + hammingArray[8])%2 == 1)
		errorKey+=8;
	
	return errorKey;		//Return the Value.
}


/*
	Function: hToG(int [], int [], char [])
	Description: This function will pass all of the arrays as parameters and
	pull the Grey code out of the hammingArray. The third array that is passed
	will be used in the gToB function.

*/

void hToG(int grey[5], int hammingArray[9], char decoder[30])
{
	//Pull the Values into the Grey Code.
	grey[0]=hammingArray[2];
	grey[1]=hammingArray[4];
	grey[2]=hammingArray[5];
	grey[3]=hammingArray[6];
	grey[4]=hammingArray[8];
	
	gToB(grey, decoder);	// Call the 'Grey to Binary' function.
	
	return;
}


/*
	Function: gToB(int [], char [])
	Description: This function will pass two arrays as parameters. The function
	will properly compute to the conversion from Grey to Binary and then compute
	the total binary value of the result. Lastly, it will then output at the location of
	the computed result.
*/

void gToB(int array[5], char decoder[30])
{
	//Temporary Variables.
	int binaryTotal = 0;
	int bArray[5]={0};
	bArray[0]=array[0];
	
	//Convert from Grey to Binary.
	for(int j =0;j<5;j++)
	{
		if(bArray[j]==0&&array[j+1]==1)
			bArray[j+1]=1;
		else if(bArray[j]==0&&array[j+1]==0)
			bArray[j+1]=0;
		else if(bArray[j]==1&&array[j+1]==0)
			bArray[j+1]=1;
		else if(bArray[j]==1&&array[j+1]==1)
			bArray[j+1]=0;
			
	}
	
	
	
	
	//Begin Figuring out what location in array character is at.
	if(bArray[0] == 1)
		binaryTotal += 16;
	
	if(bArray[1] == 1)
		binaryTotal += 8;
	
	if(bArray[2] == 1)
		binaryTotal += 4;
	
	if(bArray[3] == 1)
		binaryTotal += 2;
	
	if(bArray[4] == 1)
		binaryTotal += 1;
	
	
	//Output the Character.
		cout << decoder[binaryTotal-1];
	
	return;
}