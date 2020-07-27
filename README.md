# push-sender
Send push notification via interactive command line.

## Commands

### add project
create a new project with a name and ApiKey
### edit project
update project name and apiKey
### remove project
remove project (you can autocomplete with TAB)
### select (use) project
select the project (the ApiKey will be used)
### projects
list projects

### add device
create a new device with a name and token
### edit device
update device name and token
### remove device
remove device (you can autocomplete with TAB)
### select (use) devices
select devices to send push notification
### devices 
list devices

### send [type] --dry: 
send a message with last settings (if not selected a project/device/template/message before ask for selections)
### send 1: 
Send the last message update only template contents
### send 2:
Send the last message update template file and template contents
### send 3:
Send the last message update device selection, template file and template contents
### send 4: 
Send the last message update project, device selection, template file and template contents
### send [type] --dry:
Same as send but do not actually send the message, only logs the options selected.

### build message
build message with prompt if any template property given.

### clear
reset all selections (project/devices/template/message)

## Templates
./input folder has templates to be send as push notification.
If you provide any node with value of *$TEXT$* or *$NUMBER$* build message command step will ask those parameters.


### TODO:
- [] add cancel to the remove commands, as vorpal does not handle CTRL+C while prompt visible, and that causes remove to complete even when cancelled. 
- [] add screen shots.
- [] add support for iOs certificates
- [] add support for iOs keys
- [] add edit command for project&device
- [] add dry command to see what will happen before using the send command
- [] add sample .json documents.

 





