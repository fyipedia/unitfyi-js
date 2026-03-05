Output demo.gif
Set FontSize 14
Set Width 920
Set Height 580
Set Shell "zsh"
Set Theme "Catppuccin Mocha"
Set TypingSpeed 30ms
Set Padding 20

Type "node"
Enter
Sleep 1s

Type "const { convert, getCategoryUnits } = await import('unitfyi')"
Enter
Sleep 1.5s

Type "convert(100, 'km', 'mi')"
Enter
Sleep 2s

Type "convert(72, 'fahrenheit', 'celsius')"
Enter
Sleep 2s

Type "getCategoryUnits('length').map(u => u.symbol)"
Enter
Sleep 2.5s

Type ".exit"
Enter
Sleep 1s
