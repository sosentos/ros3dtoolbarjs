/**
 *  @author Sarah Osentoski sarah.osentoski@us.bosch.com, Halit Bener Suay benersuay@wpi.edu
 */

/**
 *
 *Supplies a list of TF Topics
 *
 *
 * @constructor
 * @param options - object with the following keys:
 *   *ros - the ROSLIB.Ros connection handle
 *   * rootObject the root object to add the visualization to
 *
 */

ROS3DTOOLBAR.TFListManager = function(options){
  var that=this;
  options=options || {};
  this.ros=options.ros;
  this.elementId=options.elementId;
  this.fixedFrame=options.fixedFrame;


  var tfListerClient= new ROSLIB.Service({
    ros : that.ros,
    name : '/tf_lister/request_list',
    serviceType : 'tf_lister/TfLister'

  });

    console.log(this.fixedFrame);
  var request = new ROSLIB.ServiceRequest({});

  tfListerClient.callService(request, function(response) {

    // This is the element we will populate with the tfs published
    var dropdown = document.getElementById(that.elementId);

    // Clear the list first
    dropdown.options.length = 0;

    // Get the list from the response
    var tfs = response.tf_list;

    // Set a helper variable
    var foundMatchingFrame = false;

    // Add all available TFs in the list
      console.log(tfs.length);
    for(var f=0; f < tfs.length; f++){

      // For each tf found, create a new option element
      var opt = document.createElement('option');
      opt.setAttribute('value',tfs[f]);
      opt.setAttribute('title',tfs[f]);
      opt.innerHTML = tfs[f];

      // And then append the option element to our list
      dropdown.appendChild(opt);

      // Check if the hard-coded fixed frame is equal to this specific option
      // If it is, then set the index to show to the user
      if(tfs[f] === that.fixedFrame){
        dropdown.selectedIndex = f;
        foundMatchingFrame = true;
	that.emit('change', that.fixedFrame);
      }
    }

    // If the hard-coded frame was not found in the list set fixed frame to the first item in the list
    if(!foundMatchingFrame){
      dropdown.selectedIndex = 0;
      that.fixedFrame=dropdown.options[0].value;
      that.emit('change', that.fixedFrame);
    }
  });

  var dropdown=document.getElementById(this.elementId);
  
  //add event listener that handles changes to frame
  dropdown.addEventListener('change', function(){
    var tfs = document.getElementById(that.elementId).options;
    var i = document.getElementById(that.elementId).selectedIndex;
    console.log('Your current fixed frame is...');
    console.log(tfs[i].value);
    
    that.fixedFrame=tfs[i].value;
    that.emit('change', that.fixedFrame);
    });

  };
  ROS3DTOOLBAR.TFListManager.prototype.__proto__=EventEmitter2.prototype;
  