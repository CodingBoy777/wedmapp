angular.module('ionicApp.filesCtrl', ['ionic'])
.controller('filesCtrl', function ($scope, $timeout, $cordovaVibration, $cordovaToast, $cordovaFile, $ionicPopup, $ionicActionSheet) {

    $scope.filelist = [];
    $scope.data = {
        showDelete: false,
        showReorder: false,
        showMfb: closed
    };

    $scope.vibration = function(time) {
        $cordovaVibration.vibrate(time);
    };

    $scope.showToast = function(message) {
        $cordovaToast.showShortBottom(message);
    };


    $scope.doRefresh = function() {
        $timeout(function () {
            $scope.$broadcast('scroll.refreshComplete');
        }, 500);
        $scope.data.showReorder = false; 
        $scope.data.showDelete = false; 
        $scope.data.showMfb = closed;
        $scope.showToast('文件列表已刷新');
    };

    $scope.isCloseMfb = function() {
        if($scope.data.showDelete || $scope.data.showReorder) {
            $scope.data.showDelete = false;
            $scope.data.showReorder = false;
            $scope.data.showMfb = closed;
        }
    };

    $scope.getFileList = function() {
        $cordovaFile.readAsText(cordova.file.externalRootDirectory + "aWEDM/data/", "filelist.json")
            .then(function (success) {
                // success
                $scope.filelist = eval('('+success+')');
            }, function (error) {
                // error
                alert(JSON.stringify(error));
            });
    };

    document.addEventListener("deviceready", function () {
        $cordovaFile.checkDir(cordova.file.externalRootDirectory, "aWEDM")
            .then(function (success) {
                // success
                if($scope.filelist.length === 0) {
                    $scope.getFileList();
                }
            }, function (error) {
                // error
                $cordovaFile.copyDir(cordova.file.applicationDirectory + "www/", "aWEDM", cordova.file.externalRootDirectory, "aWEDM")
                    .then(function (success) {
                        // success
                        $scope.showToast('已自动创建aWEDM文件夹于' + cordova.file.externalRootDirectory + '路径下');
                        $scope.getFileList();
                    }, function (error) {
                        // error
                        alert(JSON.stringify(error));
                    });
            });
    });

    $scope.writeJsonFile = function() {
        $cordovaFile.writeFile(cordova.file.externalRootDirectory + "aWEDM/data/", "filelist.json", $scope.filelist, true)
            .then(function (success) {
                // alert('成功写入filelist.json文件到' + cordova.file.externalRootDirectory + "aWEDM/data/" + '路径下');
            }, function (error) {
                alert(JSON.stringify(error));
            });
    };

    $scope.newFile = function() {
        $scope.newfile = {};

        var newPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="newfile.name">',
            title: '请输入新建文件名称',
            subTitle: '以.3b结尾',
            scope: $scope,
            buttons: [
            {   
                text: '取消',
                onTap: function(e) {
                    // console.log('你取消了新建文件操作');
                }
            },
            {
                text: '<b>确定</b>',
                type: 'button-positive',
                onTap: function(e) {
                if (!$scope.newfile.name) {
                    // 不允许用户关闭，除非输入新建文件名称
                    e.preventDefault();
                    $scope.vibration(100);
                    $scope.showToast('请输入新建文件名称');
                } else {
                    $cordovaFile.createFile(cordova.file.externalRootDirectory + "aWEDM/files/", $scope.newfile.name, false)
                        .then(function (success) {
                            // success
                            $scope.filelist.unshift($scope.newfile);
                            $scope.writeJsonFile();
                            $scope.showToast($scope.newfile.name + '已新建');            
                            
                        }, function (error) {
                            // error
                            $scope.vibration(100);
                            $scope.showToast($scope.newfile.name + '文件已存在');                       
                        });
                    
                    return $scope.newfile.name;
                    
                }
                }
            },
            ]
        });
    };


    $scope.deleteFile = function (file) {
        $cordovaFile.removeFile(cordova.file.externalRootDirectory + "aWEDM/files/", file.name)
            .then(function (success) {
                // success
                $scope.filelist.splice($scope.filelist.indexOf(file), 1);
                $scope.writeJsonFile();
                $scope.vibration(100);
                $scope.showToast(file.name + '已删除');
            }, function (error) {
                // error
                alert(JSON.stringify(error));
            });    
    };

    $scope.moveFile = function (file, fromIndex, toIndex) {
        $scope.filelist.splice(fromIndex, 1);
        $scope.filelist.splice(toIndex, 0, file);
        $scope.writeJsonFile();
    };

    $scope.onFileTap = function(file) {
        if(!($scope.data.showDelete || $scope.data.showReorder)) {
            $scope.data.showMfb = closed;
            $scope.openFile(file);
        }         
    };

    $scope.openFile = function (file) {
        var alertPopup = $ionicPopup.alert({
            title: '打开' + file.name + '文件',
            template: 'Being Developed!'
        });
    };

    $scope.onFileHold = function(file) {
        if(!($scope.data.showDelete || $scope.data.showReorder)) {
            $scope.data.showMfb = closed;
            $ionicActionSheet.show({
                titleText: '文件：' + file.name,
                buttons: [
                    { text: '重命名' },
                    { text: '置顶' }
                ],
                destructiveText: '删除',
                destructiveButtonClicked: function() {
                    $scope.deleteFile(file);
                    return true; // closes sheet
                },
                cancelText: '取消',
                cancel: function() {
                  // add cancel code..
                },
                buttonClicked: function(index) {
                    if(index === 0) {
                        $scope.renameFile(file);
                    }
                    if(index === 1) {
                        $scope.stickTopFile(file);
                    }
                    return true;
                }
            });
        }
    };

    $scope.renameFile = function (file) {
        $scope.renamefile = {};
        var renamePopup = $ionicPopup.show({
            template: '<input type="text" ng-model="renamefile.name">',
            title: '请输入' + file.name + '文件新名称',
            subTitle: '以.3b结尾',
            scope: $scope,
            buttons: [
            { text: '取消',
                onTap: function(e) {
                    // console.log('你取消了' + file.name +'的重命名操作');
                    // $scope.closeOptbtns();
                }
            },
            {
                text: '<b>确定</b>',
                type: 'button-positive',
                onTap: function(e) {
                if (!$scope.renamefile.name) {
                    // 不允许用户关闭，除非输入重命名文件新名称
                    e.preventDefault();
                    $scope.vibration(100);
                    $scope.showToast('请输入' + file.name + '文件新名称');
                } else {

                    $cordovaFile.checkFile(cordova.file.externalRootDirectory + "aWEDM/files/", $scope.renamefile.name)
                        .then(function (success) {
                            // success
                            $scope.vibration(100);
                            $scope.showToast($scope.renamefile.name + '名称已存在');
                        }, function (error) {
                            // error

                            $cordovaFile.moveFile(cordova.file.externalRootDirectory + "aWEDM/files/", file.name, cordova.file.externalRootDirectory + "aWEDM/files/", $scope.renamefile.name)
                                .then(function (success) {
                                    // success
                                    $scope.showToast(file.name + '已更名为' + $scope.renamefile.name);
                                    file.name = $scope.renamefile.name;
                                    $scope.writeJsonFile(); 
                                                                     
                                }, function (error) {
                                    // error
                                    alert(JSON.stringify(error));
                                });
                        });
                    // $scope.closeOptbtns();
                    return $scope.renamefile.name;
                }
                }
            },
            ]
        });
    };

    $scope.stickTopFile = function (file) {
        $scope.filelist.splice($scope.filelist.indexOf(file), 1);
        $scope.filelist.unshift(file);
        $scope.writeJsonFile();
        $scope.showToast(file.name + '已置顶');
    };

    $scope.doImport = function() {
        var alertPopup = $ionicPopup.alert({
            title: '导入文件列表',
            template: 'Being Developed!'
        });
    };
});