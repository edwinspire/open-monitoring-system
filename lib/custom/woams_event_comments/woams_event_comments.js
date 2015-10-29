define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!woams_event_comments/woams_event_comments.html',
    'dojo/request',
    'woams_event_comment_view/woams_event_comment_view',
    'dojo/_base/array'
], function (declare, _Widget, _Templated, templateString, R, ECV) {

    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
        load: function (_id) {
            var t = this;
            t.reset();
            R.post('/oams_php_query/event_comments_byidevent.php', {
                // Parse data from xml
                data: {idevent: _id},
                handleAs: "json"
            }).then(
                    function (response) {

                        dojo.forEach(response, function (d, i) {

                            x = new ECV();

                            x.set('values', {comment: d.comment_event, idcomment: d.ideventcomment, date_start: d.start, date_end: 'dsdada', seconds: d.seconds, status: d.status, files: ''});
                            t.Container.addChild(x);

                        });


                    },
                    function (error) {
                        // Display the error returned
                        console.log(error);
                        t.emit('notify_message', {message: error});
                    }
            );
        },
        reset: function () {
            var t = this;
            t.Container.destroyDescendants(false);
        }


    });
});
