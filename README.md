# oscarload

Node cli script to load responses into OSCAR

Requires node.js (\~v8.11.4) and npm (\~v5.6.0) be installed.

Requires AWS keys set in environment variables. Get these from OSCAR team.

    export AWS_ACCESS_KEY_ID=XXXXXXXXX
    export AWS_SECRET_ACCESS_KEY=XXXXXXXXX

Installation:

    git clone https://github.com/ulorimi/oscarload
    cd oscarload
    npm install -g

This will make the `oscarload` command available for use.

Options:

    -V, --version        output the version number
    -a, --account [a]    Account ID
    -t, --tenant [t]     Tenant RefID
    -s, --section [s]    Section RefID
    -i, --item [i]       Item RefID
    -d, --directory [d]  Directory of files to load
    -l, --list           Used for debugging - list the files already uploaded
    -h, --help           output usage information

Examples:

    $ oscarload -a my_account -t my_tenant -s my_section -i my_item -d /path/to/responses
    $ oscarload -a my_account -t my_tenant -s my_section -i my_item -l
