from urllib import urlencode
from urllib2 import urlopen
from json import loads
from re import compile, DOTALL, sub
from sys import argv

print 'Simple JavaScript / CSS minification and build system'
print 'Copyright 2012 - Nathan Osman\n'

# Parse the command line arguments
embed_css = False

if len(argv) > 1:
    if argv[1] == '--embed-css':
        embed_css = True
    else:
        print 'Unrecognized parameter "%s"' % argv[1]
        exit(1)

# Begin the build process
try:
    # Read the CSS file into memory
    print ' - Loading "style.css"...'
    f = open('style.css', 'r')
    css_contents = f.read()
    f.close()
    
    # Minify the CSS - this basically just removes multiple whitespace and comments
    reg_exp = compile(r'/\*.*?\*/\s*', DOTALL)
    css_contents = reg_exp.sub('', css_contents)
    css_contents = sub(r'\s+', ' ', css_contents)
    
    # Read the JavaScript file into memory
    print ' - Loading "jquery.stacktack.js"...'
    f = open('jquery.stacktack.js', 'r')
    js_contents = f.read()
    f.close()
    
    # If we are creating an external stylesheet, then write the minified CSS
    # otherwise embed the CSS in the JS file
    if embed_css:
        print ' - Injecting stylesheet into JS file...';
        js_contents = sub(r'/\* INJECTED_STYLESHEET_PLACEHOLDER \*/', '$(\'head\').append(\'<style>%s</style>\');' % css_contents, js_contents)
    else:
        print ' - Writing "style.min.css"...'
        f = open('style.min.css', 'w')
        f.write(css_contents)
        f.close()
    
    # Issue the request to Google's closure compiler to minify the script
    print ' - Minifying "jquery.stacktack.js"...'
    
    json_response = loads(urlopen('http://closure-compiler.appspot.com/compile',
                                  data=urlencode({ 'js_code':           js_contents,
                                                   'compilation_level': 'SIMPLE_OPTIMIZATIONS',
                                                   'output_format':     'json',
                                                   'output_info':       'compiled_code', })).read())
    
    # Write the minified file to disk
    print ' - Writing "jquery.stacktack.min.js"...'
    f = open('jquery.stacktack.min.js', 'w')
    f.write(json_response['compiledCode'])
    f.close()
    
    print '\nCompilation process complete'
    
except Exception as e:
    print '\nAn error has occurred: ' + str(e)
    exit(1)