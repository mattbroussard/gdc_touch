# About

This is the source for Matt Broussard's and Robert Lynch's touch kiosk web interface for GDC (part of the BWI project).
Open source code from jQuery, iScroll, Font Awesome, and ROSjs libraries are included.

# Usage Notes

- The application can run on any webserver that supports PHP.
- Data sources and other settings can be configured in js/config.js
- Some modules are disabled currently and can be turned on in index.php
- To specify location, use a GET parameter in the form of ?location=3N to specify 3rd floor north, for example. This is necessary for floor number display and for ROS messages to be targeted to a specific screen.
- Not included here for licensing reasons are several font files (Gotham; previously Helvetica Neue) that are needed for the application to display correctly.
- Not included here for security reasons are map images.
- If you need the aforementioned missing files to run the application, let us know in person.
- For ROS communcations to work, you must run rosbridge on farnsworth. Messages are sent and received on topic /gdc_touch. This feature is a work in progress and the format has not been fully specified.- For ROS communcations to work, you must run rosbridge on farnsworth. Messages are sent and received on topic /gdc_touch. This feature is a work in progress and the message format has not been fully specified yet (tentatively JSON strings).

# Project Status

In the fall, Robert and Matt will both be taking the CS378 course and will continue improving this application while working on other projects. Negotiating the deployment of a milestone version of the application on the screens is currently in progress.
