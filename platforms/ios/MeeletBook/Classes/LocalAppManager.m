//
//  LocalAppManager.m
//  MeeletBook
//
//  Created by jill on 15/10/31.
//
//

#import "Global.h"
#import "MainViewController.h"
#import "LocalAppManager.h"
#import "RCTBridge.h"

@implementation LocalAppManager

@synthesize bridge = _bridge;
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(openLesson:(NSString*)lessonId callback:(RCTResponseSenderBlock)callback){
    dispatch_async(dispatch_get_main_queue(), ^{
        MainViewController* ctrl = [[MainViewController alloc] init];
        ctrl.startPage = @"index.html";
        
        UIWindow *window = [[[UIApplication sharedApplication] delegate] performSelector:@selector(window)];
        UIViewController *viewController = window.rootViewController;
        [viewController presentViewController:ctrl animated:YES completion:nil];
    });

    callback(@[[NSNull null]]);
}

@end
