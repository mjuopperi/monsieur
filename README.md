Monsieur [![Build Status](https://travis-ci.org/mjuopperi/monsieur.svg?branch=master)](https://travis-ci.org/mjuopperi/monsieur)
========
**Monsieur** is a monitoring app that receives temperature data from Raspberry Pi clients and displays it as pretty graphs.

It's implemented with a Node.js Express server using a PostgreSQL database.

## Development server setup

### Dependencies

[Node.js v5](https://nodejs.org/en/download/package-manager/) for the server and
[Vagrant](https://www.vagrantup.com/) with [VirtualBox](https://www.virtualbox.org/) and [Ansible 1.9](https://github.com/ansible/ansible) for the development database.

Node dependencies can be installed with `npm install` from project root.

### Running the server

Start the virtual machine in project root with

    vagrant up

Run the app

    npm start

### Running tests

All tests can be run with

    npm test
