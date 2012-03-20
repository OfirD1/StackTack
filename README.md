<h2>StackTack</h2>
<p>StackTack is a tool that will fetch information about any question in the Stack Exchange network of sites and format it in a nicely-styled and functional widget.</p>

<h3>What Has Been Changed</h3>
<p>This fork contains a number of changes from the <a href="https://bitbucket.org/zamtools/stacktack">original code</a>. The details of these changes are below:</p>
<ul>
  <li>The icons and images in the sprite were removed.</li>
  <li>A build system for minifying the CSS and JS was added.</li>
  <li><code>.stacktack()</code> now operates on the current set of matched elements instead of searching for elements based on ID.</li>
  <li>Options can be specified globally yet overridden on a per-invocation and per-element basis (including <code>site</code>).</li>
  <li>API requests to the same site are grouped to cut down on requests.</li>
</ul>

<h3>Dependencies</h3>
<ul>
  <li>jQuery (only if built with <code>--disable-jquery-check</code>)</li>
</ul>

<h3>Build Dependencies</h3>
<ul>
  <li>Python 2.5+</li>
</ul>

<h3>Build Instructions</h3>
<ol>
  <li>Determine whether you want the CSS styles to be included in the minified JS file or whether you want to create an external minified CSS file.</li>
  <li>
    Run the following command:
    <pre><code>python build.py</code></pre>
    <b>Note:</b> add the <code>--enable-embed-css</code> option to the command above if you want to embed the CSS.
  </li>
  <li>You should now have a 'stacktack.min.js' file and (depending on the options you specified) a 'style.min.css' file in the 'out' folder.</li>
</ol>

<h3>Installation</h3>
<p>Adding StackTack to a page can be done as follows:</p>
<ol>
  <li>
    Add the following to the <code>&lt;head&gt;</code> section of your page (only required if the CSS was not embedded in the JS file - see above):
    <pre><code>&lt;link rel="stylesheet" href="style.css" /&gt;</code></pre>
  </li>
  <li>
    Create an element in your page like so:
    <pre><code>&lt;div class="stacktack" data-site="stackoverflow" data-id="1732348" &gt;&lt;/div&gt;</code></pre>
  </li>
  <li>
    Add the following to the end of the <code>&lt;body&gt;</code> section of your page:
    <pre><code>&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="path/to/stacktack.min.js"&gt;&lt;/script&gt;</code></pre>
  </li>
  <li>
    After the two lines above, in your <code>$(document).ready()</code> handler, select the elements you want to use with StackTack and call the <code>.stacktack()</code> plugin method on them:
    <pre><code>$('.stacktack').stacktack();</code></pre>
  </li>
</ol>