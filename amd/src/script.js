/* Include JQuery */
define(['jquery'], function($) {
    return {
        init: function(likessql, userid, moduleselect) {

            var likesSQL = likessql;
            var userId = userid;
            var moduleSelect = moduleselect;

            /* Enumeration of the possible reactions */
            var Reactions = {
                NULL: 0,
                EASY: 1,
                BETTER: 2,
                HARD: 3
            };

            /* Boolean which determine if the mouse is over or not the reaction zone */
            var reactionArray = {};
            /*  Reaction of the user for the activity */
            var reactionVotedArray = {};
            /* Total number of reaction for the activity */
            var totalVoteArray = {};
            /* Timer to see how long the mouse stay out of the reaction zone */
            var timerReactionsArray = {};
            /* Timer to see how long the mouse stay over the reaction group image */
            var timerGroupImgArray = {};

            for (var moduleId = 19; moduleId <= 22; moduleId++) {
                reactionArray[moduleId] = false;
                reactionVotedArray[moduleId] = null;
                totalVoteArray[moduleId] = null;
                timerReactionsArray[moduleId] = null;
                timerGroupImgArray[moduleId] = null;
            }

            /**
             * Function which modify the reaction group image in terms of kind of vote
             */
            function updateGroupImg(module, moduleId) {

                /* Get the number of reaction for each one of it */
                var easyVote = parseInt(module.getElementsByClassName('easy_nb')[0].innerText);
                var betterVote = parseInt(module.getElementsByClassName('better_nb')[0].innerText);
                var hardVote = parseInt(module.getElementsByClassName('hard_nb')[0].innerText);
                var groupImg = '';

                /* Add the image suffix if there is at least 1 vote for the selected reaction */
                if (easyVote) {
                    groupImg += 'E';
                }
                if (betterVote) {
                    groupImg += 'B';
                }
                if (hardVote) {
                    groupImg += 'H';
                }

                /* Modify the image source of the reaction group */
                $('#module-' + moduleId + ' .group_img').attr('src', '../blocks/like/img/group_' + groupImg + '.png');
            }

            /**
             *
             * @param moduleId
             */
            function searchModule(moduleId) {
                var assign = false;
                var resultSearch;

                likesSQL.forEach(function(element) {
                    if (parseInt(element.cmid) === moduleId) {
                        resultSearch = element;
                        assign = true;
                    }
                });

                if (!assign) {
                    resultSearch = {
                        'cmid': moduleId.toString(),
                        'type': '1',
                        'total': '0',
                        'typeone': '0',
                        'typetwo': '0',
                        'typethree': '0',
                        'uservote': '0'
                    };
                }

                return resultSearch;
            }

            /**
             *
             * @param event
             */
            function groupImgMouseOver(event) {

                /* Pointer modification to inform a possible click or interaction */
                $(this).css({'cursor': 'pointer'});

                /* Widen a little to inform that the image is mouse over */
                $(this).animate({
                    top: -1.5,
                    left: -3,
                    height: 23
                }, 100);

                /* Clear the animation queue to avoid image blinking */
                $(this).clearQueue();

                /* IF the mouse stay over at least 0.3 seconds */
                timerGroupImgArray[event.data.moduleId] = setTimeout(function() {

                    /* Reactions images modifications to black and white if no reaction has been made */
                    if (parseInt((event.data.module).getElementsByClassName('easy_nb')[0].innerText) === 0) {
                        $('#module-' + (event.data.moduleId) + ' .easy').attr('src', '../blocks/like/img/easy_BW.png');
                    }
                    if (parseInt((event.data.module).getElementsByClassName('better_nb')[0].innerText) === 0) {
                        $('#module-' + (event.data.moduleId) + ' .better').attr('src', '../blocks/like/img/better_BW.png');
                    }
                    if (parseInt((event.data.module).getElementsByClassName('hard_nb')[0].innerText) === 0) {
                        $('#module-' + (event.data.moduleId) + ' .hard').attr('src', '../blocks/like/img/hard_BW.png');
                    }

                    /*
                    * Hide the reaction group image with nice animation
                    * Completely hide the reaction group image to be sure
                    */
                    $('#module-' + (event.data.moduleId) + ' .group_img').animate({
                        top: 13,
                        left: 20,
                        height: 0
                    }, 300).hide(0);

                    /* Also hide the number of total reaction */
                    $('#module-' + (event.data.moduleId) + ' .group_nb').delay(50).hide(300);

                    /* Enable the pointer events for each reactions images */

                    /* After a short delay, show the 'Easy !' reaction image with nice animation */
                    $('#module-' + (event.data.moduleId) + ' .easy').delay(50).animate({
                        top: -15,
                        left: -20,
                        height: 20
                    }, 300)
                        .css({'pointer-events': 'auto'});

                    /* Also show the number of 'Easy !' reaction */
                    $('#module-' + (event.data.moduleId) + ' .easy_nb').delay(50).show(300);

                    /*
                    * After a delay, show the 'I'm getting better !' reaction image with nice
                    * animation
                    */
                    $('#module-' + (event.data.moduleId) + ' .better').delay(200).animate({
                        top: -15,
                        left: 25,
                        height: 20
                    }, 300)
                        .css({'pointer-events': 'auto'});

                    /* Also show the number of 'I'm getting better !' reaction */
                    $('#module-' + (event.data.moduleId) + ' .better_nb').delay(200).show(300);

                    /* After a delay, show the 'So Hard...' reaction image with nice animation */
                    $('#module-' + (event.data.moduleId) + ' .hard').delay(400).animate({
                        top: -15,
                        left: 70,
                        height: 20
                    }, 300)
                        .css({'pointer-events': 'auto'});

                    /* Also show the number of 'So Hard...' reaction */
                    $('#module-' + (event.data.moduleId) + ' .hard_nb').delay(400).show(300);
                }, 500);

                /* Reset timerReactions timer */
                clearTimeout(timerReactionsArray[event.data.moduleId]);

                /* IF the mouse stay over at least 3 seconds... */
                timerReactionsArray[event.data.moduleId] = setTimeout(function() {

                    /* BUT the mouse is not in the reaction zone */
                    if (!(reactionArray[event.data.moduleId])) {

                        /*
                        * Disable the pointer events for each reactions images. This is to avoid a
                        * bug, because this is possible  select a reaction during the hiding and
                        * it create a bad comportment
                        */

                        /*
                        * After a short delay, hide the 'So Hard...' reaction image with nice
                        * animation
                        */
                        $('#module-' + (event.data.moduleId) + ' .hard').css({'pointer-events': 'none'})
                            .delay(50).animate({
                            top: -7.5,
                            left: 80,
                            height: 0
                        }, 500);

                        /* Also hide the number of 'So Hard...' reaction */
                        $('#module-' + (event.data.moduleId) + ' .hard_nb').delay(50).hide(300);

                        /*
                        * After a delay, show the 'I'm getting better !' reaction image with nice
                        * animation
                        */
                        $('#module-' + (event.data.moduleId) + ' .better').css({'pointer-events': 'none'})
                            .delay(300).animate({
                            top: -7.5,
                            left: 35,
                            height: 0
                        }, 500);

                        /* Also hide the number of 'I'm getting better !' reaction */
                        $('#module-' + (event.data.moduleId) + ' .better_nb').delay(300).hide(300);

                        /* After a delay, hide the 'Easy !' reaction image with nice animation */
                        $('#module-' + (event.data.moduleId) + ' .easy').css({'pointer-events': 'none'})
                            .delay(600).animate({
                            top: -7.5,
                            left: -10,
                            height: 0
                        }, 500);

                        /* Also hide the number of 'Easy !' reaction */
                        $('#module-' + (event.data.moduleId) + ' .easy_nb').delay(600).hide(300);

                        updateGroupImg(event.data.module, event.data.moduleId);

                        /* Show the reaction group image with nice animation */
                        $('#module-' + (event.data.moduleId) + ' .group_img').show(0).delay(500).animate({
                            top: 0,
                            left: 0,
                            height: 20
                        }, 300);

                        /* Also show the number of total reaction */
                        $('#module-' + (event.data.moduleId) + ' .group_nb').delay(600).show(300);
                    }
                }, 2000);
            }

            /**
             *
             * @param event
             */
            function groupImgMouseOut(event) {

                /* Reset timerGroupImg timer */
                clearTimeout(timerGroupImgArray[event.data.moduleId]);

                /* IF the mouse out before the reaction group hide */
                if ($('#module-' + (event.data.moduleId) + ' .easy').css('height') === '0px') {
                    /* Come back to the original size to inform that the image is mouse out */
                    $(this).animate({
                        top: 0,
                        left: 0,
                        height: 20
                    }, 100);

                    /* Clear the animation queue to avoid image blinking */
                    $(this).clearQueue();
                }
            }

            /**
             *
             * @param event
             */
            function mouseOver(event) {

                /* Length of the text inside the toolbox to have a correct size */
                var txt = (event.data.module).getElementsByClassName(event.data.className)[0].innerText;
                var txtLength = txt.length;

                /* Modification of the toolbox width */
                $('#module-' + (event.data.moduleId) + ' .tooltip .tooltiptext').css({
                    'width': txtLength * 7,
                    'left': event.data.leftTxt
                });

                /* Pointer modification to know that we can click or interact */
                $(this).css({'cursor': 'pointer'});

                /* Widen a little to inform that the image is mouse over */
                $(this).animate({
                    top: -25,
                    left: event.data.leftReaction,
                    height: 40
                }, 100);

                /* Clear the animation queue to avoid image blinking */
                $(this).clearQueue();
            }

            /**
             *
             */
            function mouseOut(event) {
                /* Come back to the original size to inform that the image is mouse out */
                $(this).animate({
                    top: -15,
                    left: event.data.leftReaction,
                    height: 20
                }, 100);

                /* Clear the animation queue to avoid image blinking */
                $(this).clearQueue();
            }

            /**
             *
             * @param event
             */
            function onClick(event) {

                /* Get the number of 'reactionName' reaction */
                var nbReation = parseInt((event.data.module).getElementsByClassName(event.data.reactionName + '_nb')[0].innerText);

                /* Get the total number of reaction */
                totalVoteArray[event.data.moduleId] = parseInt((event.data.module).getElementsByClassName('group_nb')[0].innerText);

                /* IF there is no 'reactionName' reaction, change the emoji in black and white */
                if (nbReation === 0) {
                    $('#module-' + event.data.moduleId + ' .' + event.data.reactionName)
                        .attr('src', '../blocks/like/img/' + event.data.reactionName + '.png');
                }

                if (reactionVotedArray[event.data.moduleId] === Reactions.NULL) {

                    /* [TODO] Comment */
                    $.ajax({
                        type: 'POST',
                        url: '../blocks/like/update_db.php',
                        dataType: 'json',
                        data: {
                            func: 'insert',
                            userid: userId,
                            cmid: event.data.moduleId,
                            type: 1,
                            vote: event.data.reactionSelect
                        },
                        success: function(output) {
                            /* eslint-disable no-console */
                            console.log(output);
                            /* eslint-enable no-console */


                            /* Increment the number of 'Easy !' reaction of 1 */
                            (event.data.module).getElementsByClassName(event.data.reactionName + '_nb')[0]
                                .innerText = (nbReation + 1);

                            /* Update the text appearance to know that this is the selected reaction */
                            $('#module-' + event.data.moduleId + ' .' + event.data.reactionName + '_nb').css({
                                'font-weight': 'bold',
                                'color': '#5585B6'
                            });

                            /* Update the value of total number reaction with an increment of 1 */
                            (event.data.module).getElementsByClassName('group_nb')[0].innerText =
                                (totalVoteArray[event.data.moduleId] + 1);

                            /* Update the current reation with 'Easy !' */
                            reactionVotedArray[event.data.moduleId] = event.data.reactionSelect;

                        }
                    });
                }

                else if (reactionVotedArray[event.data.moduleId] === event.data.reactionSelect) {
                    /* [TODO] Comment */
                    $.ajax({
                        type: 'POST',
                        url: '../blocks/like/update_db.php',
                        dataType: 'json',
                        data: {
                            func: 'remove',
                            userid: userId,
                            cmid: event.data.moduleId,
                            type: 1,
                            vote: event.data.reactionSelect
                        },

                        success: function(output) {
                            /* eslint-disable no-console */
                            console.log(output);
                            /* eslint-enable no-console */


                            /* Decrement the number of 'Easy !' of 1 */
                            nbReation--;

                            /* Update the number of 'Easy !' reaction */
                            (event.data.module).getElementsByClassName(event.data.reactionName + '_nb')[0].innerText = nbReation;

                            /* Update the text appearance to know that this is no longer the selected reaction */
                            $('#module-' + event.data.moduleId + ' .' + event.data.reactionName + '_nb').css({
                                'font-weight': 'normal',
                                'color': 'black'
                            });

                            /*
                                * IF after the decrementation, the number of 'Easy !' reaction is 0
                                * THEN change the emoji in black and white
                                */
                            if (nbReation === 0) {
                                $('#module-' + event.data.moduleId + ' .' + event.data.reactionName)
                                    .attr('src', '../blocks/like/img/' + event.data.reactionName + '_BW.png');
                            }

                            /* Update the value of total number reaction with an decrement of 1 */
                            (event.data.module).getElementsByClassName('group_nb')[0].innerText =
                                (totalVoteArray[event.data.moduleId] - 1);

                            /* Update the current reaction with 'none reaction' */
                            reactionVotedArray[event.data.moduleId] = Reactions.NULL;
                        }
                    });
                }

                else {
                    /* [TODO] Comment */
                    $.ajax({
                        type: 'POST',
                        url: '../blocks/like/update_db.php',
                        dataType: 'json',
                        data: {
                            func: 'update',
                            userid: userId,
                            cmid: event.data.moduleId,
                            type: 1,
                            vote: event.data.reactionSelect
                        },

                        success: function(output) {
                            /* eslint-disable no-console */
                            console.log(output);
                            /* eslint-enable no-console */


                            /* Increment the number of 'Easy !' reaction of 1 */
                            (event.data.module).getElementsByClassName(event.data.reactionName + '_nb')[0]
                                .innerText = (nbReation + 1);

                            /* Update the text appearance to know that this is the selected reaction */
                            $('#module-' + (event.data.moduleId) + ' .' + (event.data.reactionName) + '_nb').css({
                                'font-weight': 'bold',
                                'color': '#5585B6'
                            });

                            var reationSelectName;
                            switch (reactionVotedArray[event.data.moduleId]) {
                                case Reactions.EASY:
                                    reationSelectName = 'easy';
                                    break;
                                case Reactions.BETTER:
                                    reationSelectName = 'better';
                                    break;
                                case Reactions.HARD:
                                    reationSelectName = 'hard';
                                    break;
                            }

                            /*  Get the current number of 'I'm getting better !' reaction and decrement it of 1 */
                            var nbReationSelect = parseInt((event.data.module)
                                .getElementsByClassName(reationSelectName + '_nb')[0].innerText) - 1;

                            /* Update the value of 'I'm getting better !' reaction */
                            (event.data.module).getElementsByClassName(reationSelectName + '_nb')[0].innerText = nbReationSelect;

                            /* Update the text appearance to know that this is no longer the selected reaction */
                            $('#module-' + (event.data.moduleId) + ' .' + reationSelectName + '_nb').css({
                                'font-weight': 'normal',
                                'color': 'black'
                            });

                            /*
                            * IF after the decrementation, the number of 'I'm getting better !'
                            * reaction is 0 THEN change the emoji in black and white
                            */
                            if (nbReationSelect === 0) {
                                $('#module-' + (event.data.moduleId) + ' .' + reationSelectName)
                                    .attr('src', '../blocks/like/img/' + reationSelectName + '_BW.png');
                            }

                            /* Update the current reation with 'Easy !' */
                            reactionVotedArray[event.data.moduleId] = event.data.reactionSelect;
                        }
                    });
                }

            }

            /**
             *
             * @param event
             */
            function reactionMouseOver(event) {

                /* The mouse is over the reaction zone */
                reactionArray[event.data.moduleId] = true;
            }

            /**
             *
             * @param event
             */
            function reactionMouseOut(event) {

                /* The mouse is out the reaction zone */
                reactionArray[event.data.moduleId] = false;

                /* Reset timerReactions timer */
                clearTimeout(timerReactionsArray[event.data.moduleId]);

                /* IF the mouse stay over at least 3 seconds... */
                timerReactionsArray[event.data.moduleId] = setTimeout(function() {

                    /* BUT that the mouse is note in the reaction zone */
                    if (!(reactionArray[event.data.moduleId])) {

                        /*
                        * Disable the pointer events for each reactions images. This is to avoid a
                        * bug, because this is possible  select a reaction during the hiding and
                        * it create a bad comportment
                        */

                        /*
                        * After a short delay, hide the 'So Hard...' reaction image with nice
                        * animation
                        */

                        $('#module-' + (event.data.moduleId) + ' .hard').css({'pointer-events': 'none'})
                            .delay(50).animate({
                            top: -7.5,
                            left: 80,
                            height: 0
                        }, 500);

                        /* Also hide the number of 'So Hard...' reaction */
                        $('#module-' + (event.data.moduleId) + ' .hard_nb').delay(50).hide(300);

                        /*
                        * After a delay, show the 'I'm getting better !' reaction image with nice
                        * animation
                        */
                        $('#module-' + (event.data.moduleId) + ' .better').css({'pointer-events': 'none'})
                            .delay(300).animate({
                            top: -7.5,
                            left: 35,
                            height: 0
                        }, 500);

                        /* Also hide the number of 'I'm getting better !' reaction */
                        $('#module-' + (event.data.moduleId) + ' .better_nb').delay(300).hide(300);

                        /* After a delay, hide the 'Easy !' reaction image with nice animation */
                        $('#module-' + (event.data.moduleId) + ' .easy').css({'pointer-events': 'none'})
                            .delay(600).animate({
                            top: -7.5,
                            left: -10,
                            height: 0
                        }, 500);

                        /* Also hide the number of 'Easy !' reaction */
                        $('#module-' + (event.data.moduleId) + ' .easy_nb').delay(600).hide(300);

                        updateGroupImg(event.data.module, event.data.moduleId);

                        /* Show the reaction group image with nice animation */
                        $('#module-' + (event.data.moduleId) + ' .group_img').show(0).delay(500).animate({
                            top: 0,
                            left: 0,
                            height: 20
                        }, 300);

                        /* Also show the number of total reaction */
                        $('#module-' + (event.data.moduleId) + ' .group_nb').delay(600).show(300);
                    }
                }, 1000);
            }

            /* Wait that the DOM is fully loaded. */
            $(function() {

                    moduleSelect.forEach(function(moduleId) {

                        var likesModule = searchModule(moduleId);

                        /* Create the HTML block necessary to each activity */
                        var htmlBlock = '<div class="reactions">' +
                            '<!-- EASY ! --><span class="tooltip">' +
                            '<img src="../blocks/like/img/easy.png" alt=" " class="easy"/>' +
                            '<span class="tooltiptext easy_txt">Fastoche !</span></span>' +
                            '<span class="easy_nb">' + likesModule.typeone + '</span>' +
                            '<!-- I\'M GETTING BETTER --><span class="tooltip">' +
                            '<img src="../blocks/like/img/better.png" alt=" " class="better"/>' +
                            '<span class="tooltiptext better_txt">Je m\'améliore !</span></span>' +
                            '<span class="better_nb">' + likesModule.typetwo + '</span>' +
                            '<!-- SO HARD... --><span class="tooltip">' +
                            '<img src="../blocks/like/img/hard.png" alt=" " class="hard"/>' +
                            '<span class="tooltiptext hard_txt">Dur dur...</span></span>' +
                            '<span class="hard_nb">' + likesModule.typethree + '</span></div>' +
                            '<!-- GROUP --><div class="group">' +
                            '<img src="" alt=" " class="group_img"/>' +
                            '<span class="group_nb">' + likesModule.total + '</span></div>';

                        /* Export the HTML block */
                        $('#module-' + moduleId + ' .activityinstance').append(htmlBlock);

                        switch (parseInt(likesModule.uservote)) {
                            case 1:
                                reactionVotedArray[moduleId] = Reactions.EASY;
                                /* Update the text appearance to know that this is the selected reaction */
                                $('#module-' + moduleId + ' .easy_nb').css({'font-weight': 'bold', 'color': '#5585B6'});
                                break;
                            case 2:
                                reactionVotedArray[moduleId] = Reactions.BETTER;
                                /* Update the text appearance to know that this is the selected reaction */
                                $('#module-' + moduleId + ' .better_nb').css({
                                    'font-weight': 'bold',
                                    'color': '#5585B6'
                                });
                                break;
                            case 3:
                                reactionVotedArray[moduleId] = Reactions.HARD;
                                /* Update the text appearance to know that this is the selected reaction */
                                $('#module-' + moduleId + ' .hard_nb').css({'font-weight': 'bold', 'color': '#5585B6'});
                                break;
                            default:
                                reactionVotedArray[moduleId] = Reactions.NULL;
                                break;
                        }

                        /* Shortcut to select the 'module-' + moduleId ID in the page */
                        var module = document.getElementById('module-' + moduleId);

                        updateGroupImg(module, moduleId);

                        /* Management of the reaction group */
                        $('#module-' + moduleId + ' .group_img')

                        /* MOUSE OVER */
                            .mouseover({module: module, moduleId: moduleId}, groupImgMouseOver)

                            /* MOUSE OUT */
                            .mouseout({moduleId: moduleId}, groupImgMouseOut);

                        /* Management of the 'Easy !' reaction */
                        $('#module-' + moduleId + ' .easy')

                        /* MOUSE OVER */
                            .mouseover({
                                module: module, moduleId: moduleId, className: 'easy_txt',
                                leftTxt: 15, leftReaction: -30
                            }, mouseOver)

                            /* MOUSE OUT */
                            .mouseout({leftReaction: -20}, mouseOut)

                            /* ON CLICK */
                            .click({
                                module: module, moduleId: moduleId, reactionName: 'easy',
                                reactionSelect: Reactions.EASY
                            }, onClick);

                        /* Management of the 'I'm getting better !' reaction */
                        $('#module-' + moduleId + ' .better')

                        /* MOUSE OVER */
                            .mouseover({
                                module: module, moduleId: moduleId, className: 'better_txt',
                                leftTxt: 40, leftReaction: 15
                            }, mouseOver)

                            /* MOUSE OUT */
                            .mouseout({leftReaction: 25}, mouseOut)

                            /* ON CLICK */
                            .click({
                                module: module, moduleId: moduleId, reactionName: 'better',
                                reactionSelect: Reactions.BETTER
                            }, onClick);

                        /* Management of the 'So hard...' reaction */
                        $('#module-' + moduleId + ' .hard')

                        /* MOUSE OVER */
                            .mouseover({
                                module: module, moduleId: moduleId, className: 'hard_txt',
                                leftTxt: 105, leftReaction: 60
                            }, mouseOver)

                            /* MOUSE OUT */
                            .mouseout({leftReaction: 70}, mouseOut)

                            /* ON CLICK */
                            .click({
                                module: module, moduleId: moduleId, reactionName: 'hard',
                                reactionSelect: Reactions.HARD
                            }, onClick);


                        /* Management of the reaction zone */
                        $('#module-' + moduleId + ' .reactions')

                        /* MOUSE OVER */
                            .mouseover({moduleId: moduleId}, reactionMouseOver)

                            /* MOUSE OUT */
                            .mouseout({module: module, moduleId: moduleId}, reactionMouseOut);
                    });
                }
            );
        }
    };
});
