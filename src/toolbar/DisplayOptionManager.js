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

ROS3DTOOLBAR.DisplayOptionManager = function(options){
  var that=this;
  options=options || {};
  this.elementId=options.elementId;


  //List of types we can display
  this.displayoptions=[];
  this.displayoptions.push(['Axes', 'AxesNode']);
  this.displayoptions.push(['Camera', 'CameraNode']);
  //this.displayoptions.push(['Snapshot', "SnapshotNode"]);
  this.displayoptions.push(['Grid', 'GridNode']);
  //this.displayoptions.push(['GridCells', "GridCellsNode"]);
  //this.displayoptions.push(['Image', "ImageNode"]);
  this.displayoptions.push(['InteractiveMarker', 'InteractiveMarkerNode']);
  this.displayoptions.push(['LaserScan', 'LaserScanNode']);
  //this.displayoptions.push(['Map', "MapNode"]);
  this.displayoptions.push(['Marker', 'MarkerNode']);
  //this.displayoptions.push(['Path', "PathNode"]);
  //this.displayoptions.push(['Pose',"PoseNode"]);
  //this.displayoptions.push(['PoseArray', "PoseArrayNode"]);
  this.displayoptions.push(['PointCloud2', 'PointCloud2Node']);
  //this.displayoptions.push(['Polygon', "PolygonNode"]);
  //this.displayoptions.push(['Odometry', "OdometryNode"]);
  //this.displayoptions.push(['Range', "RangeNode"]);
  this.displayoptions.push(['RobotModel', 'RobotModelNode']);
  this.displayoptions.push(['TF', 'TFNode']);

  var addDisplayDropdown = document.createElement('select');
  addDisplayDropdown.setAttribute('id','addDisplayDropdown');

  //populate the addItemDropdown List
    for(var i=0; i<this.displayoptions.length; i++){
      // For each item in the list new option element
      var opt = document.createElement('option');
      opt.setAttribute('value',this.displayoptions[i][0]);
      opt.setAttribute('title',this.displayoptions[i][0]);
      opt.innerHTML = this.displayoptions[i][0];

      // And then append the option element to our list
      addDisplayDropdown.appendChild(opt);
    }
    var container=document.getElementById(this.elementId);
    container.appendChild(addDisplayDropdown);
  //add event listener that handles changes to frame
  addDisplayDropdown.addEventListener('change', function(){
//    var displays = this.options;
    var i = this.selectedIndex;
    
    var selectedDisplay=that.displayoptions[i];
    console.log(selectedDisplay);
    that.emit('change', selectedDisplay);
    });

  };

ROS3DTOOLBAR.DisplayOptionManager.prototype.__proto__=EventEmitter2.prototype;
  