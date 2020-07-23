# push-sender
Send push notification via interactive command line.

##Commands

### add project
create a new project with a name and ApiKey
### remove project
remove project (you can autocomplete with TAB)
### select (use) project
select the project (the ApiKey will be used)

### add device
create a new device with a name and token
### remove device
remove device (you can autocomplete with TAB)
### select (use) devices
select devices to send push notification

### send: 
send a message with last settings (if not selected a project/device/template/message before ask for selections)
### send 1: 
Send the last message update only template contents
### send 2:
Send the last message update template file and template contents
### send 3:
Send the last message update device selection, template file and template contents
### send 4: 
Send the last message update project, device selection, template file and template contents

### build message


### TODO:
- [] add cancel to the remove commands, as vorpal does not handle CTRL+C while prompt visible, and that causes remove to complete even when cancelled. 
- [] add screen shots.
- [] add support for iOs certificates
- [] add support for iOs keys
- [] add edit command for project&device
- [] add dry command to see what will happen before using the send command
- [] add sample .json documents.

 





