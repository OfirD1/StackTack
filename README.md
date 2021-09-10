<h2>StackTack</h2>
<p>StackTack is a tool that will fetch information about any question in the Stack Exchange network of sites and format it in a nicely-styled and functional widget.</p>

<h3>What Has Been Changed</h3>
<p>This fork has few changes from the already <a href="https://github.com/nathan-osman/StackTack">forked StackTack</a>. The changes are:
<ul>
  <li><code>build.py</code> was transformed to Python 3.</li>
  <li>Dedicated <code>demo</code> folder was added, with a shorter <code>demo.html</code> file.</li>
  <li>Few documentation fixes and changes.</li>
</ul>

<h3>Dependencies</h3>
<ul>
  <li>jQuery (only if built with <code>--disable-jquery-check</code>)</li>
</ul>

<h3>Build Dependencies</h3>
<ul>
  <li>Python 3+ (required by the build system, <a href="https://github.com/nathan-osman/Juice-Builder">Juice Builder</a>)</li>
</ul>

<h3>Build Instructions</h3>
<ol>
  <li>Determine whether you want the CSS styles to be included in the minified JS file or whether you want to create an external minified CSS file.</li>
  <li>
    Run the following command:
    <pre><code>python build.py</code></pre>
    <b>Note:</b> add the <code>--enable-embed-css</code> option to the command above if you want to embed the CSS.
  </li>
  <li>You should now have a <code>'stacktack.min.js'</code> file and (depending on the options you specified) a <code>'style.min.css'</code> file in the <code>'out'</code> folder.</li>
</ol>
<h3>Running the demo</h3>
<p>
    <a href="https://jsfiddle.net/6c2wo0mb/">Live demo is hosted on jsFiddle</a>.
    <ul>
        <li>
            <strong>Note:</strong> Currently, the live demo is possible by serving the Github source files through <a href="https://combinatronics.com/">Combinatorics</a>. However, this would probably break someday in the future, as such services tend to. 
        </li>
    </ul>
</p>
<p>To run the demo locally:</p>
<ol>
    <li>
        <p>
            Run the following commands:
            <pre><code>cd demo<br/>python -m http.serve</code></pre>
            <b>Notes:</b> 
            <ol>
                <li>The default port is <code>8000</code>, but you can specify another port, <a href="https://stackoverflow.com/questions/15328623/simple-file-server-to-serve-current-directory">see here</a>.</li>
                <li>The minified files in the <code>demo</code> folder are a copy of the resultant files after following the <strong>Build Instructions</strong> section above.</li>
            </ol>
        </p>
  </li>
  <li>Browse to <a href="http://localhost:8000/demo.html">http://localhost:8000/demo.html</a>.</li>
</ol>

<h3>Using StackTack</h3>
<p>Adding StackTack to a page is relatively simple and consists of the following steps:</p>
<ol>
  <li>
    If you <b>did not</b> build StackTack with the <code>--enable-embed-css</code> option, add the following line to the <code>&lt;head&gt;</code> section of your page:
    <pre><code>&lt;link rel="stylesheet" href="style.min.css" /&gt;</code></pre>
  </li>
  <li>
    If you built StackTack with the <code>--disable-jquery-check</code> option, you will need to manually load jQuery by adding the following to the end of the <code>&lt;body&gt;</code> section of your page:
    <pre><code>&lt;script type="text/javascript" src="http://code.jquery.com/jquery-latest.min.js"&gt;&lt;/script&gt;</code></pre>
  </li>
  <li>
    Add StackTack to the <code>&lt;body&gt;</code> section of your page:
    <pre><code>&lt;script type="text/javascript" src="stacktack.min.js"&gt;&lt;/script&gt;</code></pre>
  </li>
  <li>
    To insert a StackTack widget on the page, use the following template:
    <pre><code>&lt;div class="stacktack" data-site="stackoverflow" data-id="1732348" data-answers="all"&gt;&lt;/div&gt;</code></pre>
    The <code>&lt;div&gt;</code> contains a number of <code>data-*</code> attributes that specify the options for that particular instance. These options include:
    <ul>
      <li><b>answers:</b> specifies the answers that will be displayed - this can be 'all', 'none', 'accepted', or a comma-separated list of answer IDs</li>
      <li><b>id:</b> the ID of the question <i>[required]</i></li>
      <li><b>question:</b> whether or not to display the question</li>
      <li><b>secure:</b> whether to use HTTPS when retrieving data from the API</li>
      <li><b>site:</b> the site to retrieve the question from</li>
      <li><b>tags:</b> whether or not to display the question's tags</li>
      <li><b>votes:</b> whether or not to display vote score on answers</i>
      <li><b>width:</b> the width (in pixels) of the widget</li>
    </ul>
    These options (except 'id') can also be specified in a map in the <code>.stacktack()</code> method in the previous step.
  </li>
</ol>
