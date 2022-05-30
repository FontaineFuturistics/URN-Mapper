URN-Mapper by Liam Estell

This code allows users to create URNs, easy to remember keywords which can be configured to point at any address.
This removes the need to remember complex urls or domain names, such as google Ngram which I always forget.

To add new mappings simple change mappings.json

To install the URN mapper as a search emgine in your browser see below instructions

To Setup on Local Machine
    Download from github
    Change "address" in settings.json to localhost:8080
    Configure started folder
        Put a shortcut to run.bat in %AppData%\Microsoft\Windows\Start Menu\Programs\Startup
    Configure Browser
        NOTE: You will need to adapt these instructions to your browser
        For Microsoft Edge/Chrome
            Go to settings
            Go to "Privacy, Search, and Services"
            Scroll to bottom
            Go to "Address Bar and Search"
            Go to "Manage Search Engines"
            Add a search engine
                Name: Go!
                Keyword: go
                Url: localhost:8080/search?q=%s

To add to browser from server host
    Go to add new search engine
        see above instructions
        Name: Go!
        Keyword: 
        Url: {server}/search?q=%s

Configuration
    This section refers to the headers in the settings.json file
    address refers to the address where the mapper is running, this rarely needs to be changed
    documentation is the urn to display the documentation
    json is the urn to display the raw json
    port is the port on which to host the sever
    hide is a dictionary of all urns to hide from the documentation for easter egg reasons
    tolerance is the fraction of innacuracy that is allowed for the URN-Mappers corrective algorithm
    true-search is a boolean which determines whether to do a google search on a failed search