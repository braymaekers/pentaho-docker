import re

# Read combined_compressed.js into String
readFile = open("combined_compressed.js", "r")
output = readFile.read()
readFile.close()

# Use Regex to delete comments
output = re.sub('/\*([^\n]*\n)*?\*/', '', output)

# Use Regex to remove new lines
output = re.sub('\n', '', output)

# Write final result of combined_compressed.js into itself
outFile = open("combined_compressed.js", "w")

outFile.write( '/*!\n' )
outFile.write( ' * Ext JS Library 2.0.2\n' )
outFile.write( ' * Copyright(c) 2006-2008, Ext JS, LLC.\n' )
outFile.write( ' *\n' )
outFile.write( ' * http://extjs.com/license\n' )
outFile.write( ' */\n' )
outFile.write( output )

outFile.close()