# DevCLI
DevCli is a cli with a lot (well, soon I hope) of functions to make your life easier.

## Install

```shell script
    npm install -g @psyycker/devcli
```

## Available commands

### remove-node-modules

Will recursively remove all node_modules folders.

```shell script
    remove-node-modules .
```


```shell script
    remove-node-modules ./myProject
```

It's more useful when you want to compress all your projects (for some reasons) and want to get rid of all the
node_modules first.

## TODO
- Detect unused projects: This will track all projects where files hasn't been modified in more than 1 month. Can 
help in case of cleanup in your project directory

- node_modules stats: Will give stats about the node_modules folder in your project (weight, number of files, etc)
It's just to brag about how your node_modules are big!

- init step server: Will do the initialisation of the smallstep server.

- start step server: will start the CA smallstep server. It has to be configured before using the init step server

- get ctr expiration date: Will give the expiration date of a crt file
