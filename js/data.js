var navDate={
      //账号管理
       "AccountNumber":[
           {
               "title": "账号管理",
               "icon": "person_pin",
               "href": "page/main.html",
               "spread": false,
               "children":[  {
                   "title": "管理员账号",
                   "icon": "enhanced_encryption",
                   "href": "page/main.html",
                   "spread": false
               },
                   {
                       "title": "教职账号",
                       "icon": "person",
                       "href": "page/accout_teacher.html",
                       "spread": false
                   },
                   {
                       "title": "学生账号",
                       "icon": "school",
                       "href": "page/accout_student.html",
                       "spread": false
                   },
                   {
                       "title": "家长账号",
                       "icon": "wc",
                       "href": "page/accout_studentParent.html",
                       "spread": false
                   }]
           },
           {
               "title": "基础设置",
               "icon": "layers",
               "href": "page/set_major.html",
               "spread": false,
               "children": [
                   {
                       "title": "专业设置",
                       "icon": "public",
                       "href": "page/set_major.html",
                       "spread": false
                   },
                   {
                       "title": "专业部设置",
                       "icon": "event_available",
                       "href": "page/set_group.html",
                       "spread": false
                   },
                   {
                       "title": "班级设置",
                       "icon": "group",
                       "href": "page/set_classgrade.html",
                       "spread": false
                   },
                   {
                       "title": "学期设置",
                       "icon": "assignment",
                       "href": "page/set_Term.html",
                       "spread": false
                   },
                   {
                       "title": "周次设置",
                       "icon": "date_range",
                       "href": "page/set_Week.html",
                       "spread": false
                   },
                   {
                       "title": "请假设置",
                       "icon": "event_available",
                       "href": "page/set_Leave.html",
                       "spread": false
                   },
                   {
                       "title": "寝室管理",
                       "icon": "domain",
                       "href": "page/set_dormitory.html",
                       "spread": false
                   },
                   {
                       "title": "考勤设备",
                       "icon": "nfc",
                       "href": "page/set_kaoqingDevices.html",
                       "spread": false
                   }
               ]
           }
           // },
           // {
           //     "title": "课程管理",
           //     "icon": "web",
           //     "href": "page/major_set.html",
           //     "spread": false,
           //     "children":[
           //         {
           //             "title": "课程设置",
           //             "icon": "grid_on",
           //             "href": "page/studyTime_seting.html",
           //             "spread": false
           //         }
           //         ]
           // }


       ],
      //系统设置
        "system_set":[
            {
                "title": "系统设置",
                "icon": "settings",
                "href": "page/major_set.html",
                "spread": false,
                "children":[
                    {
                        "title": "资料设置",
                        "icon": "&#xe61c;",
                        "href": "page/404.html",
                        "spread": false
                    },
                    {
                        "title": "账号安全设置",
                        "icon": "&#xe609;",
                        "href": "page/404.html",
                        "spread": false
                    }
                ]}

        ],
      //学生处
        "Student_Office":[
            {
                "title": "学生",
                "icon": "school",
                "href": "",
                "spread": false,
                "children": [
                            {
                                "title": "学生列表",
                                "icon": "assignment",
                                "href": "page/pprojectForStudent_AllList.html",
                                "spread": false
                            },
                            {
                                "title": "批量打分",
                                "icon": "done_all",
                                "href": "page/pprojectForStudent_Score.html",
                                "spread": false
                            },
                           {
                                "title": "打分记录",
                                 "icon": "format_list_numbered",
                                 "href": "page/pprojectForStudentDeleteRecord.html",
                                "spread": false
                            }
                        ]
            },
            {
                "title": "班级",
                "icon": "group",
                "href": "",
                "spread": false,
                "children": [
                    {
                        "title": "班级评比",
                        "icon": "line_weight",
                        "href": "page/pprojectForClassgrade_DetailedForScore.html",
                        "spread": false
                    },
                    {
                        "title": "考评录入",
                        "icon": "done_all",
                        "href": "page/pprojectForClassgrade_Score.html",
                        "spread": false
                    },
                    {
                        "title": "班评比项",
                        "icon": "dns",
                        "href": "page/pprojectForClassgrade_than.html",
                        "spread": false
                    },
                    {
                        "title": "班打分项",
                        "icon": "create",
                        "href": "page/pprojectForClassgrade_ScoreItemList.html",
                        "spread": false
                    },
                    {
                        "title": "考评记录",
                        "icon": "subject",
                        "href": "page/classRecordHistory.html",
                        "spread": false
                    }
                ]
            },
            {
                "title": "考勤",
                "icon": "flag",
                "href": "",
                "spread": false,
                "children": [
                    {
                        "title": "考勤记录",
                        "icon": "format_list_bulleted",
                        "href": "page/Punch_getPunchs.html",
                        "spread": false
                    },
                    {
                        "title": "考勤设置",
                        "icon": "settings",
                        "href": "page/Punch_set.html",
                        "spread": false
                    }
                ]
            },
            {
                "title": "请假",
                "icon": "event_available",
                "href": "",
                "spread": false,
                "children": [
                    {
                        "title": "审批",
                        "icon": "assignment_turned_in",
                        "href": "page/leave_getApplys.html",
                        "spread": false
                    }
                ]
            },
            {
                "title": "核心素养",
                "icon": "local_activity",
                "href": "page/Score_term.html",
                "spread": false,
                "children": [
                    {
                        "title": "评比项",
                        "icon": "dns",
                        "href": "page/pprojectRorStudent_treeList.html",
                        "spread": false
                    },
                    {
                        "title": "打分项",
                        "icon": "create",
                        "href": "page/pprojectRorStudent_term.html",
                        "spread": false
                    },
                    {
                        "title": "数据汇总",
                        "icon": "equalizer",
                        "href": "page/pprojectForStudent_tree_echars.html",
                        "spread": false
                    }
                ]
            },
            {
                "title": "寝室",
                "icon": "domain",
                "href": "",
                "spread": false,
                "children":[
                    {
                        "title": "寝室管理",
                        "icon": "hotel",
                        "href": "page/dormitory_getDormitorys.html",
                        "spread": false
                    },
                    {

                        "title": "住校学生",
                        "icon": "assignment_ind",
                        "href": "page/dormitory_AllNameList.html",
                        "spread": false
                    },{
                        "title": "每日住校",
                        "icon": "event",
                        "href": "page/dormitory_NameList.html",
                        "spread": false
                    },{
                        "title": "住校审批",
                        "icon": "assignment_turned_in",
                        "href": "page/dormitory_Apply.html",
                        "spread": false
                    },{
                        "title": "智能排寝",
                        "icon": "wifi_tethering",
                        "href": "page/dormitory_wisdomSort.html",
                        "spread": false
                    },{
                        "title": "停住名单",
                        "icon": "error",
                        "href": "page/dormitory_Stop.html",
                        "spread": false
                    },
                    {
                        "title": "发起停住",
                        "icon": "open_in_browser",
                        "href": "page/dormitory_checkStop.html",
                        "spread": false
                    },{
                        "title": "退住记录",
                        "icon": "remove_circle",
                        "href": "page/dormitory_back.html",
                        "spread": false
                    }
                    ,{
                        "title": "发起退住",
                        "icon": "open_in_browser",
                        "href": "page/dormitory_checkBack.html",
                        "spread": false
                    }
                ]},
               {
                "title": "晚自修",
                "icon": "timelapse",
                "href": "",
                "spread": false,
                "children":[
                    {
                        "title": "座位表",
                        "icon": "assignment",
                        "href": "page/classgradeSeat_getSeats.html",
                        "spread": false
                    },
                    {
                        "title": "竞赛生",
                        "icon": "assistant_photo",
                        "href": "page/classgradeSeat_matchList.html",
                        "spread": false
                    }]
              },
              {
                "title": "值班",
                "icon": "perm_contact_calendar",
                "href": "",
                "spread": false,
                "children":[
                    {
                        "title": "值班日程",
                        "icon": "dns",
                        "href": "page/duty_getDutys.html",
                        "spread": false
                    },
                    {
                        "title": "调班记录",
                        "icon": "swap_vertical_circle",
                        "href": "page/duty_Change.html",
                        "spread": false
                    },{
                        "title": "申请调班",
                        "icon": "open_in_browser",
                        "href": "page/duty_Change_set.html",
                        "spread": false
                    },
                    {
                        "title": "代班记录",
                        "icon": "today",
                        "href": "page/duty_agent.html",
                        "spread": false
                    },{
                        "title": "申请代班",
                        "icon": "open_in_browser",
                        "href": "page/duty_agent_set.html",
                        "spread": false
                    },{
                        "title": "推送设置",
                        "icon": "send",
                        "href": "page/duty_set.html",
                        "spread": false
                    }]
              }
              // ,
            // {
            //     "title": "消息中心",
            //     "icon": "email",
            //     "href": "",
            //     "spread": false,
            //     "children":[
            //         {
            //             "title": "我的消息",
            //             "icon": "email",
            //             "href": "page/MyMessage.html",
            //             "spread": false
            //         }
            //     ]}

        ],
      //班主任
        "class_master":[
            {
                "title": "学生",
                "icon": "school",
                "href": "",
                "spread": false,
                "children": [
                    {
                        "title": "学生列表",
                        "icon": "assignment",
                        "href": "page/pprojectForStudent_student_C.html",
                        "spread": false
                    },
                    {
                        "title": "批量打分",
                        "icon": "done_all",
                        "href": "page/pprojectForStudent_Headmaster_Score.html",
                        "spread": false
                    },
                    {
                        "title": "班内记录",
                        "icon": "chrome_reader_mode",
                        "href": "page/pprojectForStudent_gradeInclassScoreHistory.html",
                        "spread": false
                    },
                    {
                        "title": "打分记录",
                        "icon": "format_list_numbered",
                        "href": "page/pprojectForStudentDeleteRecord.html",
                        "spread": false
                    }
                ]
            },
            {
                "title": "班级",
                "icon": "group",
                "href": "",
                "spread": false,
                "children": [
                    {
                        "title": "班级评比",
                        "icon": "line_weight",
                        "href": "page/pprojectForClassgrade_DetailedForScore.html",
                        "spread": false
                    }, {
                        "title": "考评记录",
                        "icon": "recent_actors",
                        "href": "page/classRecordHistory.html",
                        "spread": false
                    }]
            }
            ,
            {
                "title": "考勤",
                "icon": "flag",
                "href": "",
                "spread": false,
                "children": [
                    {
                        "title": "考勤记录",
                        "icon": "swap_vertical_circle",
                        "href": "page/Punch_getPunchs.html",
                        "spread": false
                    }]
            },
            {
                "title": "请假",
                "icon": "event_available",
                "href": "",
                "spread": false,
                "children": [
                    {
                        "title": "审批",
                        "icon": "assignment_turned_in",
                        "href": "page/leave_getApplys.html",
                        "spread": false
                    },
                    {
                        "title": "发起",
                        "icon": "open_in_browser",
                        "href": "page/leave_Leaveprocess.html",
                        "spread": false
                    }
                ]
            },
            {
                "title": "晚自修",
                "icon": "web",
                "href": "page/major_set.html",
                "spread": false,
                "children":[
                    // {
                    //     "title": "班级课表",
                    //     "icon": "grid_on",
                    //     "href": "page/studyTime_Class.html",
                    //     "spread": false
                    // },
                    // {
                    //     "title": "拖拽座位",
                    //     "icon": "today",
                    //     "href": "page/classgradeSeat_ceshi.html",
                    //     "spread": false
                    // },
                    {
                        "title": "本班座位",
                        "icon": "today",
                        "href": "page/classgradeSeat_getClass_seat.html",
                        "spread": false
                    },
                    {
                        "title": "座位表",
                        "icon": "assignment",
                        "href": "page/classgradeSeat_getSeats.html",
                        "spread": false
                    }
                ]
            },
            {
                "title": "核心素养",
                "icon": "local_activity",
                "href": "page/Score_term.html",
                "spread": false,
                "children": [
                    {
                        "title": "评比项",
                        "icon": "dns",
                        "href": "page/pprojectForStudent_treeList_look.html",
                        "spread": false
                    },
                    {
                        "title": "打分项",
                        "icon": "create",
                        "href": "page/pprojectRorStudent_term.html",
                        "spread": false
                    },
                    {
                        "title": "数据汇总",
                        "icon": "equalizer",
                        "href": "page/pprojectForStudent_tree_echars.html",
                        "spread": false
                    }
                ]
            },
            {
                "title": "值班",
                "icon": "perm_contact_calendar",
                "href": "",
                "spread": false,
                "children":[
                    {
                        "title": "值班日程",
                        "icon": "dns",
                        "href": "page/duty_getDutys.html",
                        "spread": false
                    },
                    {
                        "title": "调班记录",
                        "icon": "swap_vertical_circle",
                        "href": "page/duty_Change.html",
                        "spread": false
                    },{
                        "title": "申请调班",
                        "icon": "open_in_browser",
                        "href": "page/duty_Change_set.html",
                        "spread": false
                    },
                    {
                        "title": "代班记录",
                        "icon": "today",
                        "href": "page/duty_agent.html",
                        "spread": false
                    },{
                        "title": "申请代班",
                        "icon": "open_in_browser",
                        "href": "page/duty_agent_set.html",
                        "spread": false
                    }
                ]
            }
            // ,
            // {
            //     "title": "消息中心",
            //     "icon": "email",
            //     "href": "",
            //     "spread": false,
            //     "children":[
            //         {
            //             "title": "我的消息",
            //             "icon": "email",
            //             "href": "page/MyMessage.html",
            //             "spread": false
            //         }
            //     ]}
        ],
      //学生中心
        "student_center":[
            {
                "title": "学生中心",
                "icon": "school",
                "href": "",
                "spread": false,
                "children": [
                    {
                        "title": "学生中心",
                        "icon": "assignment",
                        "href": "page/pprojectForStudent_student_page.html",
                        "spread": false
                    },
                    {
                        "title": "住校申请",
                        "icon": "launch",
                        "href": "page/dormitory_ApplyForStudent.html",
                        "spread": false
                    }
                    ]
            }
            // ,
            // {
            //     "title": "消息中心",
            //     "icon": "email",
            //     "href": "",
            //     "spread": false,
            //     "children":[
            //         {
            //             "title": "我的消息",
            //             "icon": "email",
            //             "href": "page/MyMessage.html",
            //             "spread": false
            //         }
            //     ]}
        ],
      //家长中心
        "family_center":[
            {
                "title": "学生中心",
                "icon": "school",
                "href": "",
                "spread": false,
                "children": [
                    {
                        "title": "学生中心",
                        "icon": "assignment",
                        "href": "page/pprojectForStudent_student_page.html",
                        "spread": false
                    }
                ]
            }
            // ,
            // {
            //     "title": "消息中心",
            //     "icon": "email",
            //     "href": "",
            //     "spread": false,
            //     "children":[
            //         {
            //             "title": "我的消息",
            //             "icon": "email",
            //             "href": "page/MyMessage.html",
            //             "spread": false
            //         }
            //     ]}
        ],
       //任课老师
        "teacher":[
            {
                "title": "学生",
                "icon": "school",
                "href": "",
                "spread": false,
                "children": [
                    {
                        "title": "学生列表",
                        "icon": "assignment",
                        "href": "page/pprojectForStudent_AllList.html",
                        "spread": false
                    },
                    {
                        "title": "批量打分",
                        "icon": "done_all",
                        "href": "page/pprojectForStudent_Score.html",
                        "spread": false
                    },
                    {
                        "title": "打分记录",
                        "icon": "format_list_numbered",
                        "href": "page/pprojectForStudentDeleteRecord.html",
                        "spread": false
                    }
                ]
            },
            {
                "title": "班级",
                "icon": "group",
                "href": "",
                "spread": false,
                "children": [
                    {
                        "title": "班级评比",
                        "icon": "line_weight",
                        "href": "page/pprojectForClassgrade_DetailedForScore.html",
                        "spread": false
                    },
                    {
                        "title": "批量考评",
                        "icon": "done_all",
                        "href": "page/pprojectForClassgrade_Score.html",
                        "spread": false
                    }
                ]
            },
            {
                "title": "晚自修",
                "icon": "web",
                "href": "page/major_set.html",
                "spread": false,
                "children":[
                    // {
                    //     "title": "班级课表",
                    //     "icon": "grid_on",
                    //     "href": "page/studyTime_Class.html",
                    //     "spread": false
                    // },
                    {
                        "title": "座位表",
                        "icon": "assignment",
                        "href": "page/classgradeSeat_getSeats.html",
                        "spread": false
                    }
                ]
            },
            {
                "title": "核心素养",
                "icon": "local_activity",
                "href": "page/Score_term.html",
                "spread": false,
                "children": [
                    {
                        "title": "评比项",
                        "icon": "dns",
                        "href": "page/pprojectForStudent_treeList_look.html",
                        "spread": false
                    },
                    {
                        "title": "打分项",
                        "icon": "create",
                        "href": "page/pprojectRorStudent_term.html",
                        "spread": false
                    },
                    {
                        "title": "数据汇总",
                        "icon": "equalizer",
                        "href": "page/pprojectForStudent_tree_echars.html",
                        "spread": false
                    }
                ]
            },
            {
                "title": "值班",
                "icon": "perm_contact_calendar",
                "href": "",
                "spread": false,
                "children":[
                    {
                        "title": "值班日程",
                        "icon": "dns",
                        "href": "page/duty_getDutys.html",
                        "spread": false
                    },
                    {
                        "title": "调班记录",
                        "icon": "swap_vertical_circle",
                        "href": "page/duty_Change.html",
                        "spread": false
                    },{
                        "title": "申请调班",
                        "icon": "open_in_browser",
                        "href": "page/duty_Change_set.html",
                        "spread": false
                    },
                    {
                        "title": "代班记录",
                        "icon": "today",
                        "href": "page/duty_agent.html",
                        "spread": false
                    },{
                        "title": "申请代班",
                        "icon": "open_in_browser",
                        "href": "page/duty_agent_set.html",
                        "spread": false
                    }
                ]
            }
            // ,
            // {
            //     "title": "课程",
            //     "icon": "web",
            //     "href": "page/major_set.html",
            //     "spread": false,
            //     "children":[
            //         {
            //             "title": "我的课表",
            //             "icon": "grid_on",
            //             "href": "page/studyTime_teacher.html",
            //             "spread": false
            //         }
            //     ]
            //
            // },
            // {
            //     "title": "消息中心",
            //     "icon": "email",
            //     "href": "",
            //     "spread": false,
            //     "children":[
            //         {
            //             "title": "我的消息",
            //             "icon": "email",
            //             "href": "page/MyMessage.html",
            //             "spread": false
            //         }
            //     ]}

        ],
       //团委
        "Youth":[
            {
                "title": "学生",
                "icon": "school",
                "href": "",
                "spread": false,
                "children": [
                    {
                        "title": "学生列表",
                        "icon": "assignment",
                        "href": "page/pprojectForStudent_AllList.html",
                        "spread": false
                    },
                    {
                        "title": "批量打分",
                        "icon": "done_all",
                        "href": "page/pprojectForStudent_Score.html",
                        "spread": false
                    },
                    {
                        "title": "打分记录",
                        "icon": "format_list_numbered",
                        "href": "page/pprojectForStudentDeleteRecord.html",
                        "spread": false
                    }
                ]
            },
            {
                "title": "班级",
                "icon": "group",
                "href": "",
                "spread": false,
                "children": [
                    {
                        "title": "班级评比",
                        "icon": "line_weight",
                        "href": "page/pprojectForClassgrade_DetailedForScore.html",
                        "spread": false
                    },
                    {
                        "title": "批量考评",
                        "icon": "done_all",
                        "href": "page/pprojectForClassgrade_Score.html",
                        "spread": false
                    }]
            },
            {
                "title": "核心素养",
                "icon": "local_activity",
                "href": "page/Score_term.html",
                "spread": false,
                "children": [
                    {
                        "title": "评比项",
                        "icon": "dns",
                        "href": "page/pprojectForStudent_treeList_look.html",
                        "spread": false
                    },
                    {
                        "title": "打分项",
                        "icon": "create",
                        "href": "page/pprojectRorStudent_term.html",
                        "spread": false
                    },
                    {
                        "title": "数据汇总",
                        "icon": "equalizer",
                        "href": "page/pprojectForStudent_tree_echars.html",
                        "spread": false
                    }
                ]
            },{
                "title": "值班",
                "icon": "perm_contact_calendar",
                "href": "",
                "spread": false,
                "children":[
                    {
                        "title": "值班日程",
                        "icon": "dns",
                        "href": "page/duty_getDutys.html",
                        "spread": false
                    },
                    {
                        "title": "调班记录",
                        "icon": "swap_vertical_circle",
                        "href": "page/duty_Change.html",
                        "spread": false
                    },{
                        "title": "申请调班",
                        "icon": "open_in_browser",
                        "href": "page/duty_Change_set.html",
                        "spread": false
                    },
                    {
                        "title": "代班记录",
                        "icon": "today",
                        "href": "page/duty_agent.html",
                        "spread": false
                    },{
                        "title": "申请代班",
                        "icon": "open_in_browser",
                        "href": "page/duty_agent_set.html",
                        "spread": false
                    }
                ]
            }
            // ,
            // {
            //     "title": "消息中心",
            //     "icon": "email",
            //     "href": "",
            //     "spread": false,
            //     "children":[
            //         {
            //             "title": "我的消息",
            //             "icon": "email",
            //             "href": "page/MyMessage.html",
            //             "spread": false
            //         }
            //     ]}
        ],
       //专业部
        "group":[
            {
                "title": "学生",
                "icon": "school",
                "href": "",
                "spread": false,
                "children": [
                    {
                        "title": "学生列表",
                        "icon": "assignment",
                        "href": "page/pprojectForStudent_AllList.html",
                        "spread": false
                    },
                    {
                        "title": "批量打分",
                        "icon": "done_all",
                        "href": "page/pprojectForStudent_Score.html",
                        "spread": false
                    },
                    {
                        "title": "打分记录",
                        "icon": "format_list_numbered",
                        "href": "page/pprojectForStudentDeleteRecord.html",
                        "spread": false
                    }
                ]
            },
            {
                "title": "班级",
                "icon": "group",
                "href": "",
                "spread": false,
                "children": [
                    {
                        "title": "班级评比",
                        "icon": "line_weight",
                        "href": "page/pprojectForClassgrade_DetailedForScore.html",
                        "spread": false
                    },{
                        "title": "考评记录",
                        "icon": "subject",
                        "href": "page/classRecordHistory.html",
                        "spread": false
                    }
                    ]
            },
            {
                "title": "考勤",
                "icon": "flag",
                "href": "",
                "spread": false,
                "children": [
                    {
                        "title": "考勤记录",
                        "icon": "swap_vertical_circle",
                        "href": "page/Punch_getPunchs.html",
                        "spread": false
                    }]
            },
            {
                "title": "请假",
                "icon": "event_available",
                "href": "",
                "spread": false,
                "children": [
                    {
                        "title": "审批",
                        "icon": "assignment_turned_in",
                        "href": "page/leave_getApplys.html",
                        "spread": false
                    }
                ]
            },
            // {
            //     "title": "课程",
            //     "icon": "web",
            //     "href": "page/major_set.html",
            //     "spread": false,
            //     "children":[
            //         {
            //             "title": "班级课表",
            //             "icon": "grid_on",
            //             "href": "page/studyTime_Class.html",
            //             "spread": false
            //         }
            //     ]
            //
            // },
            {
                "title": "晚自修",
                "icon": "web",
                "href": "page/major_set.html",
                "spread": false,
                "children":[
                    // {
                    //     "title": "班级课表",
                    //     "icon": "grid_on",
                    //     "href": "page/studyTime_Class.html",
                    //     "spread": false
                    // },
                    {
                        "title": "座位表",
                        "icon": "assignment",
                        "href": "page/classgradeSeat_getSeats.html",
                        "spread": false
                    }
                ]
            },
            {
                "title": "核心素养",
                "icon": "local_activity",
                "href": "page/Score_term.html",
                "spread": false,
                "children": [
                    {
                        "title": "评比项",
                        "icon": "dns",
                        "href": "page/pprojectForStudent_treeList_look.html",
                        "spread": false
                    },
                    {
                        "title": "打分项",
                        "icon": "create",
                        "href": "page/pprojectRorStudent_term.html",
                        "spread": false
                    },
                    {
                        "title": "数据汇总",
                        "icon": "equalizer",
                        "href": "page/pprojectForStudent_tree_echars.html",
                        "spread": false
                    }
                ]
            },{
                "title": "值班",
                "icon": "perm_contact_calendar",
                "href": "",
                "spread": false,
                "children":[
                    {
                        "title": "值班日程",
                        "icon": "dns",
                        "href": "page/duty_getDutys.html",
                        "spread": false
                    },
                    {
                        "title": "调班记录",
                        "icon": "swap_vertical_circle",
                        "href": "page/duty_Change.html",
                        "spread": false
                    },{
                        "title": "申请调班",
                        "icon": "open_in_browser",
                        "href": "page/duty_Change_set.html",
                        "spread": false
                    },
                    {
                        "title": "代班记录",
                        "icon": "today",
                        "href": "page/duty_agent.html",
                        "spread": false
                    },{
                        "title": "申请代班",
                        "icon": "open_in_browser",
                        "href": "page/duty_agent_set.html",
                        "spread": false
                    }
                ]
            }
            // , {
            //     "title": "消息中心",
            //     "icon": "email",
            //     "href": "",
            //     "spread": false,
            //     "children":[
            //         {
            //             "title": "我的消息",
            //             "icon": "email",
            //             "href": "page/MyMessage.html",
            //             "spread": false
            //         }
            //     ]}
        ],
       //实训处
        "Training_Office":[
            {
                "title": "学生",
                "icon": "school",
                "href": "",
                "spread": false,
                "children": [
                    {
                        "title": "学生列表",
                        "icon": "assignment",
                        "href": "page/pprojectForStudent_AllList.html",
                        "spread": false
                    },
                    {
                        "title": "批量打分",
                        "icon": "done_all",
                        "href": "page/pprojectForStudent_Score.html",
                        "spread": false
                    },
                    {
                        "title": "打分记录",
                        "icon": "format_list_numbered",
                        "href": "page/pprojectForStudentDeleteRecord.html",
                        "spread": false
                    }
                ]
            },
            {
                "title": "班级",
                "icon": "group",
                "href": "",
                "spread": false,
                "children": [
                    {
                        "title": "班级评比",
                        "icon": "line_weight",
                        "href": "page/pprojectForClassgrade_DetailedForScore.html",
                        "spread": false
                    },
                    {
                        "title": "批量考评",
                        "icon": "done_all",
                        "href": "page/pprojectForClassgrade_Score.html",
                        "spread": false
                    }]
            },
            {
                "title": "核心素养",
                "icon": "local_activity",
                "href": "page/Score_term.html",
                "spread": false,
                "children": [
                    {
                        "title": "评比项",
                        "icon": "dns",
                        "href": "page/pprojectForStudent_treeList_look.html",
                        "spread": false
                    },
                    {
                        "title": "打分项",
                        "icon": "create",
                        "href": "page/pprojectRorStudent_term.html",
                        "spread": false
                    },
                    {
                        "title": "数据汇总",
                        "icon": "equalizer",
                        "href": "page/pprojectForStudent_tree_echars.html",
                        "spread": false
                    }
                ]
            },
            {
                "title": "值班",
                "icon": "perm_contact_calendar",
                "href": "",
                "spread": false,
                "children":[
                    {
                        "title": "值班日程",
                        "icon": "dns",
                        "href": "page/duty_getDutys.html",
                        "spread": false
                    },
                    {
                        "title": "调班记录",
                        "icon": "swap_vertical_circle",
                        "href": "page/duty_Change.html",
                        "spread": false
                    },{
                        "title": "申请调班",
                        "icon": "open_in_browser",
                        "href": "page/duty_Change_set.html",
                        "spread": false
                    },
                    {
                        "title": "代班记录",
                        "icon": "today",
                        "href": "page/duty_agent.html",
                        "spread": false
                    },{
                        "title": "申请代班",
                        "icon": "open_in_browser",
                        "href": "page/duty_agent_set.html",
                        "spread": false
                    }
                ]
            }
            // ,
            // {
            //     "title": "消息中心",
            //     "icon": "email",
            //     "href": "",
            //     "spread": false,
            //     "children":[
            //         {
            //             "title": "我的消息",
            //             "icon": "email",
            //             "href": "page/MyMessage.html",
            //             "spread": false
            //         }
            //     ]}
        ],
       //医务室
       "doctor_Office":[
           {
               "title": "学生",
               "icon": "school",
               "href": "",
               "spread": false,
               "children": [
                   {
                       "title": "学生列表",
                       "icon": "assignment",
                       "href": "page/pprojectForStudent_AllList.html",
                       "spread": false
                   },
                   {
                       "title": "批量打分",
                       "icon": "done_all",
                       "href": "page/pprojectForStudent_Score.html",
                       "spread": false
                   },
                   {
                       "title": "打分记录",
                       "icon": "format_list_numbered",
                       "href": "page/pprojectForStudentDeleteRecord.html",
                       "spread": false
                   }
               ]
           },
           {
               "title": "班级",
               "icon": "group",
               "href": "",
               "spread": false,
               "children": [
                   {
                       "title": "班级评比",
                       "icon": "line_weight",
                       "href": "page/pprojectForClassgrade_DetailedForScore.html",
                       "spread": false
                   },
                   {
                       "title": "批量考评",
                       "icon": "done_all",
                       "href": "page/pprojectForClassgrade_Score.html",
                       "spread": false
                   }]
           },
           {
               "title": "核心素养",
               "icon": "local_activity",
               "href": "page/Score_term.html",
               "spread": false,
               "children": [
                   {
                       "title": "评比项",
                       "icon": "dns",
                       "href": "page/pprojectForStudent_treeList_look.html",
                       "spread": false
                   },
                   {
                       "title": "打分项",
                       "icon": "create",
                       "href": "page/pprojectRorStudent_term.html",
                       "spread": false
                   }
                   ,
                   {
                       "title": "数据汇总",
                       "icon": "equalizer",
                       "href": "page/pprojectForStudent_tree_echars.html",
                       "spread": false
                   }
               ]
           },
           {
               "title": "值班",
               "icon": "perm_contact_calendar",
               "href": "",
               "spread": false,
               "children":[
                   {
                       "title": "值班日程",
                       "icon": "dns",
                       "href": "page/duty_getDutys.html",
                       "spread": false
                   },
                   {
                       "title": "调班记录",
                       "icon": "swap_vertical_circle",
                       "href": "page/duty_Change.html",
                       "spread": false
                   },{
                       "title": "申请调班",
                       "icon": "open_in_browser",
                       "href": "page/duty_Change_set.html",
                       "spread": false
                   },
                   {
                       "title": "代班记录",
                       "icon": "today",
                       "href": "page/duty_agent.html",
                       "spread": false
                   },{
                       "title": "申请代班",
                       "icon": "open_in_browser",
                       "href": "page/duty_agent_set.html",
                       "spread": false
                   }
               ]
           }
           // ,
           // {
           //     "title": "消息中心",
           //     "icon": "email",
           //     "href": "",
           //     "spread": false,
           //     "children":[
           //         {
           //             "title": "我的消息",
           //             "icon": "email",
           //             "href": "page/MyMessage.html",
           //             "spread": false
           //         }
           //     ]}
       ],
    //打分专员
    "ScoreUser":[
        {
            "title": "学生",
            "icon": "school",
            "href": "",
            "spread": false,
            "children": [
                {
                    "title": "学生列表",
                    "icon": "assignment",
                    "href": "page/pprojectForStudent_student_C.html",
                    "spread": false
                },
                {
                    "title": "批量打分",
                    "icon": "done_all",
                    "href": "page/pprojectForStudent_Headmaster_Score.html",
                    "spread": false
                },
                {
                    "title": "班内记录",
                    "icon": "chrome_reader_mode",
                    "href": "page/pprojectForStudent_gradeInclassScoreHistory.html",
                    "spread": false
                },
                {
                    "title": "打分记录",
                    "icon": "format_list_numbered",
                    "href": "page/pprojectForStudentDeleteRecord.html",
                    "spread": false
                }
            ]
        }
    ]
}

