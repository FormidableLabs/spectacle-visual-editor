// This is a temporary page to allow us to test the Netlify Identity functions
// before they are implemented in the actual frontend.
export const getTempFrontend = (myUrl: string): string => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Temporary Identity Test</title>
    <script type="text/javascript" src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
  </head>
  <body>
    <div style="padding: 20px;">
    <h3>How to log in with email/password on local dev</h3>
      <ol>
        <li>If you haven't yet, sign up using the login link below and confirm your email, but ignore the site it redirects you to</li>
        <li>Log in again with this link <div data-netlify-identity-button></div></li>
        <li>Test with the button below</li>
      </ol>
    <h3>How to log in with third party provider (eg. Github) on local dev</h3>
      <ol>
        <li>Open the dev console, go the the "Network" tab and set "Preserve Log" to enabled</li>
        <li>Log in with this link <div data-netlify-identity-button></div></li>
        <li>On success it will redirect you to the production site root URL, ignore this and click the back button</li>
        <li>In the network tab, look for the last 302 redirect and find its Location response header.  Copy the URL from this</li>
        <li>Paste that URL into the browser address, but replace everything before the # with<pre>${myUrl}</pre></li>
        <li>You should be logged in now, click the test button to see if it's working</li>
      </ol>
      <button onClick="testit()">Test my login</button>
      <div id="testresult" style="display: none">
        <br>
        Looks like it works! Logged in as:
        <br>
        <img style="width: 60px; border-radius: 20px" id="avatar" /><br>
        <div id="displayname"></div>
        <br>
        Copy the following <b>Authorization</b> header into your GraphQL studio settings:
        <pre><div id="jwt"></div></pre>
        This is the URL you will want to use as your GraphQL endpoint:
        <pre><a href="${myUrl.split('?')[0]}">${myUrl.split('?')[0]}</a></pre>
      </div>
    </div>
  </body>
  </html>
  
  <script>
      async function testit() {
          const jwt = await netlifyIdentity.refresh();
          if (jwt) {
            document.getElementById('jwt').innerText = 'Bearer ' + jwt;
            const result = await fetch('/.netlify/functions/api/', {
                method: 'POST',
                headers: { 
                    Authorization: 'Bearer ' + jwt,
                    'Content-Type': 'application/json'
                },
                body: '{"query": "{ myUser { id, name, email, avatarUrl, lastSeen } }"}'
            });
            const json = await result.json();
            if (json && json.data && json.data.myUser) {
              document.getElementById('testresult').style.display = 'block';
              if (json.data.myUser.avatarUrl) { 
                document.getElementById('avatar').src = json.data.myUser.avatarUrl;
              }
              if (json.data.myUser.name) {
                document.getElementById('displayname').innerText = json.data.myUser.name;
              }
            }
          }
        }

  </script>`;
};
