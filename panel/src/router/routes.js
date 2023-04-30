import auth from './middleware'

const routes = [{
    path: '/login',
    name: 'login',
    component: () => import('pages/login.vue')
  },
  {
    path: '/',
    meta: {
      middlewares: [auth]
    },
    component: () => import('layouts/MainLayout.vue'),
    children: [{
        meta: {
          middlewares: [auth]
        },
        path: '/',
        component: () => import('pages/dash.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/hashtag',
        component: () => import('pages/hashtag.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/academyComment',
        component: () => import('pages/academyComment.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/shopComment',
        component: () => import('pages/shopComment.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/schoolComment',
        component: () => import('pages/schoolComment.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/bookComment',
        component: () => import('pages/bookComment.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/crashReporter',
        component: () => import('pages/crashReporter.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/formula',
        component: () => import('pages/formula.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/userList',
        component: () => import('pages/userList.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/chatList/:itemId',
        component: () => import('pages/chatList.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/chatContent/:itemId/:userId',
        component: () => import('pages/chatContent.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/notificationHistory',
        component: () => import('pages/notificationHistory.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/importanceOfLessonsComment',
        component: () => import('pages/importanceOfLessonsComment.vue')
      },      
      {
        meta: {
          middlewares: [auth]
        },
        path: '/document',
        component: () => import('pages/document.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/examPackage',
        component: () => import('pages/examPackage.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/frequentlyQuestion',
        component: () => import('pages/frequentlyQuestion.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/frequentlyQuestionCategories',
        component: () => import('pages/frequentlyQuestionCategories.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/updateApp',
        component: () => import('pages/updateApp.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/vipPstMedia',
        component: () => import('pages/vipPstMedia.vue')
      },

      {
        meta: {
          middlewares: [auth]
        },
        path: '/refPrice',
        component: () => import('pages/refPrice.vue')
      },

      {
        meta: {
          middlewares: [auth]
        },
        path: '/periodMentorPriceList',
        component: () => import('pages/periodMentorPriceList.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/setting',
        component: () => import('pages/setting.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/reasonList',
        component: () => import('pages/reasonList.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/userNumber',
        component: () => import('pages/userNumber.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/demoTour',
        component: () => import('pages/demoTour.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/periodMentorMediaComment',
        component: () => import('pages/periodMentorMediaComment.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/setProgramList',
        component: () => import('pages/setProgramList.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/setProgramExitUser',
        component: () => import('pages/setProgramExitUser.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/callLog',
        component: () => import('pages/callLog.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/setProgramPayment',
        component: () => import('pages/setProgramPayment.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/callPayment',
        component: () => import('pages/callPayment.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/mentorAvailableTime',
        component: () => import('pages/mentorAvailableTime.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/periodMentor',
        component: () => import('pages/periodMentor.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/periodMentorRate',
        component: () => import('pages/periodMentorRate.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/periodMentorPayment',
        component: () => import('pages/periodMentorPayment.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/periodMentorMedia',
        component: () => import('pages/periodMentorMedia.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/periodMentorMediaFile',
        component: () => import('pages/periodMentorMediaFile.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/onlineCallPackage',
        component: () => import('pages/onlineCallPackage.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/feedbackCall',
        component: () => import('pages/feedbackCall.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/feedbackCallUser',
        component: () => import('pages/feedbackCallUser.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/package',
        component: () => import('pages/package.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/publisher',
        component: () => import('pages/publisher.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/frequentlyQuestionItem/:itemId',
        component: () => import('pages/frequentlyQuestion.vue')
      },

      {
        meta: {
          middlewares: [auth]
        },
        path: '/publisher/:itemId',
        component: () => import('pages/publisherSeries.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/publisher/:itemId/:subId',
        component: () => import('pages/publisherSeriesBook.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/provinces',
        component: () => import('pages/provinces.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/onlineCall',
        component: () => import('pages/onlineCall.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/ambassadorCode',
        component: () => import('pages/ambassadorCode.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/ambassadorCode/:itemId',
        props: true,
        component: () => import('pages/ambassadorCodeSub.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/media/periodMentor/:itemId',
        props: true,
        component: () => import('pages/periodMediaSub.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/media/periodUser/:itemId',
        props: true,
        component: () => import('pages/periodUserMediaSub.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/periodMentorMediaFile/:itemId',
        props: true,
        component: () => import('pages/periodMediaFileSub.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/motto',
        component: () => import('pages/motto.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/banner',
        component: () => import('pages/banner.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/shoppingPrice',
        component: () => import('pages/shoppingPrice.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/malisonLists',
        component: () => import('pages/malisonLists.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/mentorPackageList',
        component: () => import('pages/mentorPackageList.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/onlineCallMentor',
        component: () => import('pages/onlineCallMentor.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/vipPst',
        component: () => import('pages/vipPst.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/vipPst/:itemId',
        props: true,
        component: () => import('pages/vipPstSub.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/vipPstComment',
        component: () => import('pages/vipPstComment.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/provinces/:provinceId',
        props: true,
        component: () => import('pages/cities.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/test',
        component: () => import('pages/test.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/academy',
        component: () => import('pages/academy.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/school',
        component: () => import('pages/school.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/ads',
        component: () => import('pages/ads.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/ads/:itemId',
        component: () => import('pages/adsSub.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/itemReport',
        component: () => import('pages/itemReport.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/itemReport/channel',
        component: () => import('src/pages/itemReportChannel.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/itemReport/chat',
        component: () => import('pages/itemReportChat.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/itemReport/shop',
        component: () => import('pages/itemReportShop.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/itemReport/PostQuestion',
        component: () => import('pages/itemReportPostQuestion.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/itemReport/PostComment',
        component: () => import('pages/itemReportPostComment.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/itemReport/postShop/:itemId',
        component: () => import('pages/itemReportPostShopSub.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/walletLog/:itemId',
        component: () => import('pages/walletLog.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/walletPaymentLog/:itemId',
        component: () => import('pages/walletPaymentLog.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/itemReport/vipPost',
        component: () => import('pages/itemReportVipPost.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/itemReport/onlineCourse',
        component: () => import('pages/itemReportOnlineCourse.vue')
      },
      
      
      {
        meta: {
          middlewares: [auth]
        },
        path: '/itemReport/vipPost/:itemId',
        component: () => import('pages/itemReportVipPostSub.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/itemReport/PostQuestion/:itemId',
        component: () => import('pages/itemReportPostQuestionSub.vue')
      },

      {
        meta: {
          middlewares: [auth]
        },
        path: '/itemReport/postComment/:itemId',
        component: () => import('pages/itemReportPostCommentSub.vue')
      },

      {
        meta: {
          middlewares: [auth]
        },
        path: '/postComment/:itemId',
        component: () => import('pages/postComment.vue')
      },
      
      {
        meta: {
          middlewares: [auth]
        },
        path: '/itemReport/Setprogram',
        component: () => import('pages/itemReportSetprogram.vue')
      },
      
      {
        meta: {
          middlewares: [auth]
        },
        path: '/itemReport/Setprogram/:itemId',
        component: () => import('pages/itemReportSetprogramSub.vue')
      },
      {
        meta: {
          middlewares: [auth]
      },
        path: '/itemReport/onlineCall',
        component: () => import('pages/itemReportOnlineCall.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/category',
        component: () => import('pages/category.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/fieldComment',
        component: () => import('pages/fieldComment.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/postComment',
        component: () => import('pages/postComment.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/category/:itemId',
        component: () => import('pages/categorySub.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/educationalField',
        component: () => import('pages/educationalField.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/importanceOfLessons',
        component: () => import('pages/importanceOfLessons.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/importanceOfLessons/:itemId',
        props: true,
        component: () => import('pages/importanceOfLessonsSub.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/educationalStage',
        component: () => import('pages/educationalStage.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/users',
        component: () => import('pages/users.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/field',
        component: () => import('pages/field.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/quiz',
        component: () => import('pages/quiz.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/product',
        component: () => import('src/pages/product.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/AllFinancial',
        component: () => import('src/pages/AllFinancial.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/FinancialMonth',
        component: () => import('src/pages/FinancialMonth.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/AllWithdrow',
        component: () => import('src/pages/AllWithdrow.vue')
      },
      
      {
        meta: {
          middlewares: [auth]
        },
        path: '/entranceExam',
        component: () => import('src/pages/entranceExam.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/entranceExam/:itemId',
        props: true,
        component: () => import('pages/entranceExamSub.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/entranceTest',
        component: () => import('src/pages/entranceTest.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/entranceTest/:itemId',
        props: true,
        component: () => import('pages/entranceExamSub.vue')
      },

      {
        meta: {
          middlewares: [auth]
        },
        path: '/academy/:itemId',
        props: true,
        component: () => import('pages/academyPerson.vue')
      },

      {
        meta: {
          middlewares: [auth]
        },
        path: '/school/:itemId',
        props: true,
        component: () => import('pages/schoolPerson.vue')
      },

      {
        meta: {
          middlewares: [auth]
        },
        path: '/postEntertainment',
        component: () => import('src/pages/postEntertainment.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path:'entertiament/postCategory/:itemId',
        component: () => import('pages/postEntertainmentSub.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/postEvent',
        component: () => import('src/pages/postEvent.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/postQuestion',
        component: () => import('src/pages/postQuestion.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path:'/PostQuestion/:itemId',
        component: () => import('src/pages/postQuestionSub.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path:'/PostQuestion/itemComment/:itemId',
        component: () => import('src/pages/postQuestionComment.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/postNews',
        component: () => import('src/pages/postNews.vue')
      },
      
       {
        meta: {
          middlewares: [auth]
        },
        path:'news/postCategory/:itemId',
        component: () => import('pages/postNewsSub.vue')
      },

      
      {
        meta: {
          middlewares: [auth]
        },
        path: '/question',
        component: () => import('src/pages/question.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/notification',
        component: () => import('src/pages/notification.vue')
      },

      {
        meta: {
          middlewares: [auth]
        },
        path: '/orders',
        component: () => import('src/pages/orders.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/education',
        component: () => import('src/pages/education.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/education/:educationId',
        props: true,
        component: () => import('pages/educationWordList.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/mentors',
        component: () => import('src/pages/mentors.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path:'/users/:itemId',
        component: () => import('src/pages/withdrawaldetail.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path:'/users/:itemId/financials',
        component: () => import('src/pages/financial.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/family',
        component: () => import('src/pages/family.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/teachers',
        component: () => import('src/pages/teachers.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path:'/productClass/:itemId',
        component: () => import('src/pages/teacherProduct.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path:'/productPayment/:itemId',
        component: () => import('src/pages/userProductPayment.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path:'/period/:itemId',
        component: () => import('src/pages/periodSub.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path:'/periodPaymentUser/:itemId',
        component: () => import('src/pages/periodPaymentUserSub.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path: '/accounting',
        component: () => import('src/pages/accounting.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path:'/accounting/:itemId',
        component: () => import('src/pages/accountingSub.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path:'/VipPosts/:itemId',
        component: () => import('src/pages/vipPostSub.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path:'/vipPstComment/:itemId',
        component: () => import('src/pages/vipPstCommentSub.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path:'/OnlinCall/:itemId',
        component: () => import('src/pages/onlineCallSub.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path:'/setProgramm/:itemId',
        component: () => import('src/pages/setProgrammSub.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path:'/setProgrammUser/:itemId',
        component: () => import('src/pages/setProgrammUserSub.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path:'/setProgramm/setProgrammAll/:itemId',
        component: () => import('src/pages/setProgrammAllSub.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path:'/setChannelList/:itemId',
        component: () => import('src/pages/setChannelListSub.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path:'/setSupportList/:itemId',
        component: () => import('src/pages/setSupportListSub.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path:'/channelListUser/:itemId',
        component: () => import('src/pages/channelListUser.vue')
      },
      
      {
        meta: {
          middlewares: [auth]
        },
        path: '/educationalfilm',
        component: () => import('src/pages/educationalfilm.vue')
      },

      {
        meta: {
          middlewares: [auth]
        },
        path: '/productManager',
        component: () => import('src/pages/productManagerPanel.vue')
      },

      {
        meta: {
          middlewares: [auth]
        },
        path: '/supportPanel',
        component: () => import('src/pages/supportPanel.vue')
      },

      {
        meta: {
          middlewares: [auth]
        },
        path: '/accountingPanel',
        component: () => import('src/pages/accountingPanel.vue')
      },

      {
        meta: {
          middlewares: [auth]
        },
        path: '/scientificGeneral',
        component: () => import('src/pages/scientificGeneralPanel.vue')
      },

      {
        meta: {
          middlewares: [auth]
        },
        path: '/scientificEntertainment',
        component: () => import('src/pages/scientificEntertainmentPanel.vue')
      },

      {
        meta: {
          middlewares: [auth]
        },
        path: '/scienceNnews',
        component: () => import('src/pages/scienceNnewsPanel.vue')
      },

      {
        meta: {
          middlewares: [auth]
        },
        path: '/callLogSub/:itemId',
        component: () => import('src/pages/callLogSub.vue')
      },
      
      {
        meta: {
          middlewares: [auth]
        },
        path: '/channelList',
        component: () => import('src/pages/channel.vue')
      },
      {
        meta: {
          middlewares: [auth]
        },
        path:'/channelList/:itemId',
        component: () => import('src/pages/channelSub.vue')
      },
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
