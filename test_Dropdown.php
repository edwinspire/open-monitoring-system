   <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
            <title>Dojo-Bootstrap</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="lib/dojo/bootstrap/css/bootstrap.css">
        </head>

        <body>

        <div class="navbar navbar-inverse navbar-fixed-top">
            <div class="navbar-inner">
                <div class="container">
                    <div class="row">
                        <a class="brand" href="index.html">Dojo Bootstrap Tests</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <section class="sidebar col-md-3"></section>
                <section id="main" class="main col-md-8">
                    <section>
                        <div class="page-header">
                            <h1>Stateful</h1>
                        </div>
                        <button type="button" id="loading-button" class="btn btn-primary" data-loading-text="Loading...">Load</button>
                    </section>

                    <section>
                        <div class="page-header">
                            <h1>Toggle</h1>
                        </div>
                        <button type="button" class="btn" data-toggle="button">Toggle</button>
                    </section>

                    <section>
                        <div class="page-header">
                            <h1>Checkbox</h1>
                        </div>
                        <div class="btn-group" data-toggle="buttons-checkbox">
                            <button type="button" class="btn btn-primary">Left</button>
                            <button type="button" class="btn">Middle</button>
<button type="button" id="loading-button" class="btn btn-primary" data-loading-text="Loading...">Load</button>
                            <button type="button" class="btn">Right</button>
                        </div>
                    </section>

                    <section>
                        <div class="page-header">
                            <h1>Radio</h1>
                        </div>
                        <div class="btn-group" data-toggle="buttons-radio">
                            <button type="button" class="btn btn-primary">Left</button>
                            <button type="button" class="btn btn-primary">Middle</button>
                            <button type="button" class="btn btn-primary">Right</button>
                        </div>
                    </section>
                </section>
            </div>
        </div>

            <button type="button" id="loading-button" class="btn btn-primary" data-loading-text="Loading...">Load</button>
<a href="#" data-toggle="tooltip" rel="tooltip" title="first tooltip">hover over me</a>

    <div class="container">
        <div class="row">
            <section class="sidebar col-md-3"></section>
            <section id="main" class="main col-md-8">
                <ul class="nav nav-pills">
                    <li class="dropdown">
                        <a class="dropdown-toggle" role="button" data-toggle="dropdown" href="#">Dropdown <b class="caret"></b></a>
                        <ul id="menu1" class="dropdown-menu" role="menu" aria-labelledby="drop4">
                            <ul><a href="#">one</a></ul>
                            <ul class="dropdown-menu" role="menu" aria-labelledby="drop4d"><li><a href="#">two</a><li></ul>
                            <ul><a href="#">three</a></ul>
                        </ul>
                    </li>
                </ul>
            </section>
        </div>
    </div>

        <?php include("header_dojo.php"); ?>

            <script>
                require(["bootstrap/Button", "dojo/query", "bootstrap/Tooltip", "bootstrap/Dropdown", "bootstrap/Button"], function (Button, query) {
                    query("#loading-button").on("click", function(e){
                        query(e.target).button('loading');
                        setTimeout(function(){
                            query(e.target).button('reset');
                        }, 2000);

                    });

query('[data-toggle="tooltip"]').tooltip();

                    query("#loading-button").on("click", function(e){
                        var target = this;
                        query(target).button('loading');
                        setTimeout(function(){
                            query(target).button('reset');
                        }, 2000);
                    });




                });
            </script>
        </body>
    </html>
