// top level data objects
var data = [];
var players = [];
var feats = [];
var feat_count = {};
var feat_count_array = [];
var sorted_feat_count_array = [];
var category_centers = {};
var category_colors = {};
var raw_response = {};
var state = "feat";

// colors
category_colors = {
    abs: "#a6cee3",
    cardio: "#1f78b4",
    "lower body": "#b2df8a",
    other: "#33a02c",
    speed: "#fb9a99",
    stretching: "#e31a1c",
    throwing: "#fdbf6f",
    "upper body": "#ff7f00",
    veggies: "#cab2d6"
}

// views
bubble_view = new Barista.Views.BubbleView({
    el: $('#bubble_target'),
    plot_height:1000,
    min_val:3,
    max_val:20,
    v_split:'category'
});


$.getJSON("data/F3.json",function(res){
	raw_response = res;
    var players = _.keys(res);
	players.forEach(function(player){
		var player_feats  = _.keys(res[player]);
		player_feats.forEach(function(feat){
			data.push({
				_id: [player,feat].join(":"),
				count: res[player][feat],
				category: feat,
                player: player,
                feat: feat
			});
            players.push(player);
            feats.push(feat);
		});
	});

    // order the feat categories by how frequent they are and
    // set the y category center to seperate out the categories
    feat_count = _.countBy(feats,function(o){return o;});
    feat_count_array = [];
    _.keys(feat_count).forEach(function(feat){
        feat_count_array.push({feat:feat,count:feat_count[feat]});
    });
    sorted_feat_count_array = _.sortBy(feat_count_array,function(o){ return o.count});
    sorted_feat_count_array.forEach(function(o,i){
        category_centers[o.feat] = {x: 0, y: -500 + i*100}
    })



    player_count = _.countBy(players,function(o){return o;});
    player_count_array = [];
    _.keys(player_count).forEach(function(player){
        player_count_array.push({player:player,count:player_count[player]});
    });
    sorted_player_count_array = _.sortBy(player_count_array,function(o){ return o.count}).reverse();



    bubble_view.category_colors = category_colors;
	bubble_view.model.set({tree_object: {name:"root", children:data} });
    sort_by_feats();
    add_tooltips();

    // bind toggles
    $("#player_toggle").click(function(){
        if (state === "feat"){
            sort_by_players();
            $("#player_toggle").toggleClass("selected");
            $("#feat_toggle").toggleClass("selected");
            state = "player";
        }
    });
    $("#feat_toggle").click(function(){
        if (state === "player"){
            sort_by_feats();
            $("#player_toggle").toggleClass("selected");
            $("#feat_toggle").toggleClass("selected");
            state = "feat";
        }
    });
});

// UTILITY FUNCTIONS
function sort_by_feats(){
    data.forEach(function(o){
        o.category = o.feat;
    });
    sorted_feat_count_array.forEach(function(o,i){
        category_centers[o.feat] = {x: 0, y: -440 + i*120}
    });
    bubble_view.category_centers = category_centers;
    bubble_view.force.start();
    draw_feat_labels();
}

function sort_by_players(){
    data.forEach(function(o){
        o.category = o.player;
    });
    var row = 0;
    var column = -1;
    var xUnit = bubble_view.width / 7;
    _.shuffle(sorted_player_count_array).forEach(function(o,i){
        column += 1;
        if (column % 5 === 0){
            row += 1;
            column = 0;
        }
        category_centers[o.player] = {x: -2*xUnit + column*xUnit, y: -610 + row*120, row:row}
    });
    bubble_view.category_centers = category_centers;
    bubble_view.force.start();
    draw_player_labels();


}

function draw_player_labels(){
    var labels = bubble_view.vis.selectAll(".label").data([]).exit().remove();
    var labels = bubble_view.vis.selectAll(".label").data(sorted_player_count_array);
    var xUnit = bubble_view.width / 7;
    var center = {x: bubble_view.width/2, y: bubble_view.height/2}
    var row_y = {
        1: 150,
        2: 250,
        3: 360,
        4: 470,
        5: 545,
        6: 615,
        7: 680,
        8: 760,
        9: 815
    }
    labels.enter()
        .append("text")
        .attr("class","label")
        .attr("x",function(d){
            return -category_centers[d.player].x*0.7 + center.x
            })
        .attr("y",function(d){return row_y[category_centers[d.player].row]})
        .attr("text-anchor","middle")
        .attr("font-family","Open Sans")
        .attr("opacity",0)
        .style("font-size","20")
        .style("pointer-events","none")
        .text(function(d){return d.player})

    labels.transition().duration(1000).attr("opacity",0.54)
}

function draw_feat_labels(){
    var labels = bubble_view.vis.selectAll(".label").data([]).exit().remove();
    var label_text = ["Throwing", "Cardio", "Upper Body", "Stretching", "Abs",
                      "Veggies", "Lower Body", "Speed", "Other"]
    var labels = bubble_view.vis.selectAll(".label").data(label_text);

    labels.enter()
        .append("text")
        .attr("class","label")
        .attr("x",50)
        .attr("y",function(d,i){return 150 + i*90})
        .attr("font-family","Open Sans")
        .attr("opacity",0)
        .style("font-size","40")
        .style("pointer-events","none")
        .text(function(d){return d})

    labels.transition().duration(1000).attr("opacity",0.54)
}

function add_tooltips(){
    $('circle').each(function(){
        var player = $(this).attr('_id').split(":")[0];
        var feat = $(this).attr('_id').split(":")[1];
        $(this).popover({
          placement: 'top',
          container: 'body',
          trigger: 'hover focus',
          title: $(this).attr('_id'),
          html: true,
          content: "<p class=text-center>" + raw_response[player][feat] + "</p>"
        });
      });
}
