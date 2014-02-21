# About

This is the web-based front-end for the touchscreen kiosks in the Bill and Melinda Gates Computer Science Complex and Dell Computer Science Hall (GDC). It was imagined as an improvement over a previous application running on these touch kiosks, and also is planned to eventually integrate with the Building Wide Intelligence project to allow interaction with the BWI robots and other components.

The project for the corresponding ROSpy+rosbridge backend is [here](https://github.com/mattbroussard/gdc_touch_backend).

# Usage Notes

If you are not affiliated with the Building Wide Intelligence project, we ask that you [contact us](mailto:mattb@cs.utexas.edu) before using any of the code or content here for other purposes. Even if you are involved with BWI, you should probably talk to me first. That said:

- The application requires a webserver that supports PHP.
- Data sources and other settings can be configured in js/config.js
- Some modules are disabled currently and can be turned on in index.php
- To specify location, use a GET parameter in the form of ?location=3N to specify 3rd floor north, for example. This is necessary for floor number display and for ROS messages to be targeted to a specific screen.
- Not included here for licensing reasons are several font files (Gotham; previously Helvetica Neue) that are needed for the application to display correctly.
- Not included here for security reasons are map images.
- If you need the aforementioned missing files to run the application, let us know in person.
- For ROS communcations to work, you must run gdc_touch_backend and rosbridge and specify the server's address in js/config.js. This feature is a work in progress.

# Project Status

This project began in Spring 2013 as part of the CS378 FRI course. Work continued (albeit slowly) in the Fall 2013 CS378 FRI continuation course. In November 2013, we successfully negotiated the deployment of the application on actual displays with the department. As of January 2014, work continues as a side project, and negotiations regarding network connectivity and planned BWI integration continue.

This project is primarily maintained by [Matt Broussard](mailto:mattb@cs.utexas.edu). [Robert Lynch](mailto:rmlynch@cs.utexas.edu) is sometimes involved.

# Open Source Components

The following components are used from other open source projects:

- [jQuery](https://jquery.com/) v1.9.1
- [iScroll](http://cubiq.org/iscroll-4) v4.2.5
- [Font Awesome](http://fortawesome.github.io/Font-Awesome/3.2.1/) v3.0.2
- [roslibjs](https://raw.github.com/RobotWebTools/roslibjs) v7-devel, including its dependency [EventEmitter2](https://github.com/hij1nx/EventEmitter2) v0.4.11

Some of these are known to be out of date and will be updated to their latest versions in a newer revision when more testing can be done.
