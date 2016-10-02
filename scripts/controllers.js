/* global angular */

'use strict';

/* Controllers */
var appControllers = angular.module('appControllers', ['iroad-relation-modal'])

    .controller('MainController', function (NgTableParams, iRoadModal, $scope, $uibModal, $log, $timeout) {
        //$scope.offenceEvent = iRoadModal("Offence Event");

        $scope.pager = {pageSize: 10};
        $scope.programName = "Offence Event";
        function createColumns(programStageDataElements) {
            var cols = []
            if (programStageDataElements) {
                programStageDataElements.forEach(function (programStageDataElement) {
                    var filter = {};
                    filter[programStageDataElement.dataElement.name.replace(" ", "")] = 'text';
                    cols.push({
                        field: programStageDataElement.dataElement.name.replace(" ", ""),
                        title: programStageDataElement.dataElement.name,
                        headerTitle: programStageDataElement.dataElement.name,
                        show: programStageDataElement.displayInReports,
                        filter: filter
                    });
                })
            }
            cols.push({
                field: "",
                title: "Action",
                headerTitle: "Action",
                show: true
            });
            return cols;
        }

        $scope.getOffences = function () {
            $scope.loading = true;
            $scope.tableParams = new NgTableParams({count: $scope.pager.pageSize}, {
                getData: function (params) {
                    $scope.pager.page = params.page();
                    // ajax request to api
                    return iRoadModal.getProgramByName($scope.programName).then(function (program) {
                        $scope.program = program;
                        return iRoadModal.getRelatedPrograms($scope.programName).then(function (programs) {
                            $scope.programs = programs;
                            $scope.tableCols = createColumns(program.programStages[0].programStageDataElements);
                            return iRoadModal.getAll($scope.programName, $scope.pager).then(function (results) {
                                $scope.pager = results.pager;
                                params.page($scope.pager.page)
                                params.total($scope.pager.total);
                                $scope.loading = false;
                                return results.events;
                            })
                        })
                    })
                }
            });
        }
        dhis2.loadData = function () {
            $scope.getOffences();
        };
        $scope.getOffences();
        //$scope.getOffences();
        $scope.showDetails = function (event) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'views/details.html',
                controller: 'DetailController',
                size: "sm",
                resolve: {
                    event: function () {
                        return event;
                    },
                    program: function () {
                        return $scope.program;
                    }
                }
            });

            modalInstance.result.then(function (resultItem) {
                iRoadModal.setRelations(event).then(function () {

                });
            }, function () {
                iRoadModal.setRelations(event).then(function () {

                });
                $log.info('Modal dismissed at: ' + new Date());
            });
        }
        $scope.showPaymentDetails = function (event) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'views/payementDetails.html',
                controller: 'PaymentDetailController',
                size: "sm",
                resolve: {
                    event: function () {
                        return event.event;
                    },
                    program: function () {
                        return $scope.program;
                    }
                }
            });

            modalInstance.result.then(function (resultItem) {
                iRoadModal.setRelations(event).then(function () {

                });
            }, function () {
                iRoadModal.setRelations(event).then(function () {

                });
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.showOffenceDetails = function (event) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'views/offenceDetails.html',
                controller: 'OffenceDetailController',
                size: "sm",
                resolve: {
                    event: function () {
                        return event.event;
                    },
                    program: function () {
                        return $scope.program;
                    }
                }
            });

            modalInstance.result.then(function (resultItem) {
                iRoadModal.setRelations(event).then(function () {

                });
            }, function () {
                iRoadModal.setRelations(event).then(function () {

                });
                $log.info('Modal dismissed at: ' + new Date());
            });
        }
        $scope.showDriver = function (event) {
            $scope.showRelationShip("Driver", event);
        }
        $scope.showVehicle = function (event) {
            $scope.showRelationShip("Vehicle", event);
        }
        $scope.showRelationShip = function (programName, event) {
            iRoadModal.getProgramByName(programName).then(function (program) {
                iRoadModal.getRelatedEvent(event, program).then(function (results) {
                    $uibModal.open({
                        animation: $scope.animationsEnabled,
                        templateUrl: 'views/details.html',
                        controller: 'DetailController',
                        size: "sm",
                        resolve: {
                            event: function () {
                                return results;
                            },
                            program: function () {
                                return program;
                            }
                        }
                    }).result.then(function (resultItem) {
                        iRoadModal.setRelations(resultItem).then(function () {

                        });
                    }, function () {

                        $log.info('Modal dismissed at: ' + new Date());
                    });
                });
            })
        }
        $scope.showEdit = function (event) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'views/addedit.html',
                controller: 'EditController',
                size: "sm",
                resolve: {
                    event: function () {
                        return event;
                    },
                    program: function () {
                        return $scope.program;
                    }
                }
            });

            modalInstance.result.then(function (resultEvent) {
                $scope.tableParams.data.forEach(function (event) {
                    if (event.event == resultEvent.event) {
                        Object.keys(event).forEach(function (key) {
                            event[key] = resultEvent[key];
                        })

                    }
                })
                $scope.tableParams.reload();
            }, function () {
                iRoadModal.setRelations(event).then(function () {

                });
                $log.info('Modal dismissed at: ' + new Date());
            });
        }
        $scope.showAddNew = function () {
            var event = {};
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'views/addedit.html',
                controller: 'EditController',
                size: "sm",
                resolve: {
                    event: function () {
                        return event;
                    },
                    program: function () {
                        return $scope.program;
                    }
                }
            });

            modalInstance.result.then(function (resultEvent) {
                $scope.tableParams.data.push(resultEvent);
            }, function () {

            });
        }
    })
    .controller('DetailController', function (iRoadModal, $scope, $uibModalInstance, program, event) {
        $scope.loading = true;
        iRoadModal.getRelations(event).then(function (newEvent) {
            $scope.event = newEvent;
            $scope.loading = false;
        })
        $scope.program = program;
        $scope.ok = function () {
            $uibModalInstance.close({});
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })
    .controller('PaymentDetailController', function (iRoadModal, $scope, NgTableParams,$uibModalInstance, program, event) {
        $scope.loading = true;
        $scope.pager = {pageSize: 10};
        $scope.programName = "Payment Reciept";
        iRoadModal.getProgramByName($scope.programName).then(function (paymentProgram) {
            paymentProgram.programStages[0].programStageDataElements.forEach(function (programStageDataElement) {
                //var dataValue = {"dataElement":programStageDataElement.dataElement.id};
                if (programStageDataElement.dataElement.name == "Program_Offence_Event") {
                    iRoadModal.find(paymentProgram.id, programStageDataElement.dataElement.id, event).then(function (events) {
                        $scope.tableParams = new NgTableParams({count: $scope.pager.pageSize}, {
                            getData: function (params) {
                                $scope.pager.page = params.page();
                                // ajax request to api
                                return iRoadModal.getProgramByName($scope.programName).then(function (program) {
                                    $scope.program = program;
                                    return iRoadModal.getRelatedPrograms($scope.programName).then(function (programs) {
                                        $scope.programs = programs;
                                        $scope.tableCols = iRoadModal.createColumns(program.programStages[0].programStageDataElements);
                                        return iRoadModal.getAll($scope.programName, $scope.pager).then(function (results) {
                                            $scope.pager = results.pager;
                                            params.page($scope.pager.page)
                                            params.total($scope.pager.total);
                                            $scope.loading = false;
                                            return results.events;
                                        })
                                    })
                                })
                            }
                        });
                    })
                }
            })
        })
        iRoadModal.getRelations(event).then(function (newEvent) {
            $scope.event = newEvent;
            $scope.loading = false;
        })
        $scope.program = program;
        $scope.ok = function () {
            $uibModalInstance.close({});
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })
    .controller('OffenceDetailController', function (iRoadModal, $scope, NgTableParams,$uibModalInstance, $uibModal, event) {
        $scope.loading = true;
        $scope.pager = {pageSize: 10};
        $scope.programName = "Payment Reciept";
        iRoadModal.getAll("Offence Registry").then(function (results) {
            $scope.availableOffences = results;
            iRoadModal.getProgramByName("Offence").then(function (offenceProgram) {
                offenceProgram.programStages[0].programStageDataElements.forEach(function (programStageDataElement) {
                    //var dataValue = {"dataElement":programStageDataElement.dataElement.id};
                    if (programStageDataElement.dataElement.name == "Program_Offence_Event") {
                        iRoadModal.find(offenceProgram.id, programStageDataElement.dataElement.id, event).then(function (events) {
                            $scope.offenceRegistriesSelected = [];//events;
                            events.forEach(function (event) {
                                event.dataValues.forEach(function (dataValue) {
                                    offenceProgram.programStages[0].programStageDataElements.forEach(function (programStageDataElement) {
                                        //var dataValue = {"dataElement":programStageDataElement.dataElement.id};
                                        if (programStageDataElement.dataElement.name == "Program_Offence_Registry" && dataValue.dataElement == programStageDataElement.dataElement.id) {
                                            //alert("hererwer");
                                            $scope.availableOffences.forEach(function (offEvent) {
                                                if (offEvent.event == dataValue.value) {
                                                    $scope.offenceRegistriesSelected.push(offEvent);
                                                }
                                            })
                                        }
                                    });
                                })
                            })
                            $scope.tableParams = new NgTableParams({count: $scope.pager.pageSize}, {
                                getData: function (params) {
                                    return iRoadModal.getProgramByName("Offence Registry").then(function (offenceRProgram) {
                                        $scope.tableCols = iRoadModal.createColumns(offenceRProgram.programStages[0].programStageDataElements,true);
                                        $scope.total = 0;
                                        offenceRProgram.programStages[0].programStageDataElements.forEach(function (programStageDataElement) {
                                            //var dataValue = {"dataElement":programStageDataElement.dataElement.id};
                                            if (programStageDataElement.dataElement.name == "Amount") {
                                                $scope.offenceRegistriesSelected.forEach(function(offenceRegistrySelected){
                                                    offenceRegistrySelected.dataValues.forEach(function(dataValue){
                                                        if(dataValue.dataElement == programStageDataElement.dataElement.id){
                                                            $scope.total += parseInt(dataValue.value);
                                                        }
                                                    })
                                                })
                                            }
                                        })
                                        return $scope.offenceRegistriesSelected;
                                    })
                                }
                            });
                            $scope.loading = false;
                        })
                    }
                })
            });
        }, function () {
        })
        $scope.showPaymentStatus = function () {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'views/payementDetails.html',
                controller: 'PaymentDetailController',
                size: "sm",
                resolve: {
                    event: function () {
                        return event;
                    },
                    program: function () {
                        return $scope.program;
                    }
                }
            });

            modalInstance.result.then(function (resultItem) {
                iRoadModal.setRelations(event).then(function () {

                });
            }, function () {
                iRoadModal.setRelations(event).then(function () {

                });
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.ok = function () {
            $uibModalInstance.close({});
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })
    .controller('EditController', function (NgTableParams, iRoadModal, $scope, $uibModalInstance, program, event, $q) {
        $scope.loading = true;
        $scope.program = program;
        iRoadModal.initiateEvent(event, program).then(function (newEvent) {
            $scope.event = newEvent;

            $scope.getDataElementIndex = function (dataElement) {
                var index = "";
                $scope.event.dataValues.forEach(function (dataValue, i) {
                    if (dataValue.dataElement == dataElement.id) {
                        index = i;
                    }
                })
                return index;
            }
            iRoadModal.getAll("Offence Registry").then(function (results) {
                $scope.availableOffences = results;
                if ($scope.event.event) {
                    iRoadModal.getProgramByName("Offence").then(function (offenceProgram) {
                        offenceProgram.programStages[0].programStageDataElements.forEach(function (programStageDataElement) {
                            //var dataValue = {"dataElement":programStageDataElement.dataElement.id};
                            if (programStageDataElement.dataElement.name == "Program_Offence_Event") {
                                iRoadModal.find(offenceProgram.id, programStageDataElement.dataElement.id, $scope.event.event).then(function (events) {
                                    $scope.offenceRegistriesSelected = [];//events;
                                    events.forEach(function (event) {
                                        event.dataValues.forEach(function (dataValue) {
                                            offenceProgram.programStages[0].programStageDataElements.forEach(function (programStageDataElement) {
                                                //var dataValue = {"dataElement":programStageDataElement.dataElement.id};
                                                if (programStageDataElement.dataElement.name == "Program_Offence_Registry" && dataValue.dataElement == programStageDataElement.dataElement.id) {
                                                    //alert("hererwer");
                                                    $scope.availableOffences.forEach(function (offEvent) {
                                                        if (offEvent.event == dataValue.value) {
                                                            $scope.offenceRegistriesSelected.push(offEvent);
                                                        }
                                                    })
                                                }
                                            });
                                        })
                                    })
                                    $scope.loading = false;
                                })
                            }
                        })
                    });
                } else {
                    $scope.offenceRegistriesSelected = [];
                    $scope.loading = false;
                }
            }, function () {
                alert("Here")
            })
        });
        $scope.save = function () {
            $scope.loading = true;
            console.log($scope.event);
            iRoadModal.save($scope.event, $scope.program).then(function (result) {
                var promises = [];
                iRoadModal.getProgramByName("Offence").then(function (offenceProgram) {
                    $scope.offenceRegistriesSelected.forEach(function (offenceRegistry) {
                        var dataValues = [];
                        offenceProgram.programStages[0].programStageDataElements.forEach(function (programStageDataElement) {
                            var dataValue = {"dataElement": programStageDataElement.dataElement.id};
                            if (programStageDataElement.dataElement.name == "Program_Offence_Event") {
                                dataValue.value = result;
                            } else if (programStageDataElement.dataElement.name == "Program_Offence_Registry") {
                                dataValue.value = offenceRegistry;
                            }
                            dataValues.push(dataValue);
                        })
                        promises.push($scope.saveOffence(dataValues, offenceRegistry, offenceProgram));
                    })
                })
                $q.all(promises).then(function () {
                    $scope.loading = false;
                    $uibModalInstance.close(result);
                }, function (error) {

                });

            }, function (error) {
                $scope.loading = false;
            });
        };
        $scope.saveOffence = function (dataValues, offenceRegistry, offenceProgram) {
            var defer = $q.defer();
            /*iRoadModal.initiateEvent({dataValues:dataValues},offenceProgram).then(function(newEvent){

             });*/
            iRoadModal.save({dataValues: dataValues}, offenceProgram).then(function (result) {
                defer.resolve();
            }, function (error) {
                $scope.loading = false;
            });
            return defer.promise;
        }
        $scope.cancel = function () {
            iRoadModal.setRelations($scope.event).then(function () {
                $uibModalInstance.dismiss('cancel');
            })
        };
    })
