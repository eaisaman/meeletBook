//
//  LocalAppManager.m
//  MeeletBook
//
//  Created by jill on 15/10/31.
//
//

#import <Pods/JSONKit/JSONKit.h>
#import "Global.h"
#import "MainViewController.h"
#import "QRCodeViewController.h"
#import "LocalAppManager.h"
#import "RCTBridge.h"

@implementation LocalAppManager

@synthesize bridge = _bridge;
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(openLesson:(NSString*)lessonId projectId:(NSString *)projectId successCallback:(RCTResponseSenderBlock)successCallback failureCallback:(RCTResponseSenderBlock)failureCallback){
    [Global showHostProject:projectId codeBlock:^{
        successCallback(@[]);
    } errorBlock:^(NSError *error) {
        failureCallback(@[[error localizedDescription]]);
    }];
}

RCT_EXPORT_METHOD(checkDownloadMode:(NSArray*)projectIdList callback:(RCTResponseSenderBlock)callback){
    if (projectIdList && projectIdList.count) {
        NSMutableArray *result = [NSMutableArray array];
        for (NSString* projectId in projectIdList) {
            NSString *mode = [Global projectMode:projectId];
            NSUInteger progress = [Global projectProgress:projectId];
            [result addObject:@{@"projectId":projectId, @"mode":mode, @"progress":[NSNumber numberWithUnsignedInteger:progress]}];
        }
        callback(@[result]);
    } else {
        callback(@[@{}]);
    }
}

RCT_EXPORT_METHOD(downloadProject:(NSString*)projectId callback:(RCTResponseSenderBlock)callback){
    [Global downloadProject:projectId];

    callback(@[]);
}

RCT_EXPORT_METHOD(pauseDownloadProject:(NSString*)projectId callback:(RCTResponseSenderBlock)callback){
    [Global pauseDownloadProject:projectId];
    
    callback(@[]);
}

RCT_EXPORT_METHOD(downloadModules:(RCTResponseSenderBlock)callback){
    [Global downloadModules];
    
    callback(@[]);
}

RCT_EXPORT_METHOD(scanQRCode:(RCTResponseSenderBlock)callback)
{
    [Global scanQRCode];
    
    callback(@[]);
}

RCT_EXPORT_METHOD(doLogin:(NSString*)loginName plainPassword:(NSString*)plainPassword successCallback:(RCTResponseSenderBlock)successCallback failureCallback:(RCTResponseSenderBlock)failureCallback){
    for (NSHTTPCookie *cookie in [[NSHTTPCookieStorage sharedHTTPCookieStorage] cookies]) {
        DLog(@"name: %@=%@;domain=%@;expires=%@\n", cookie.name, cookie.value, cookie.domain, cookie.expiresDate);
    }
    
    [[Global engine] doLogin:loginName plainPassword:plainPassword codeBlock:^(NSString *record) {
        NSMutableDictionary *recordDict = [@{} mutableCopy];
        [recordDict addEntriesFromDictionary:[record objectFromJSONString]];
        NSArray *arr = [recordDict objectForKey:@"resultValue"];
        
        if(arr.count) {
            NSDictionary *userObj = arr[0];
            [Global setLoginUser:loginName plainPassword:plainPassword userObj:userObj];
            
            dispatch_async(dispatch_get_main_queue(), ^{
                [Global dispatchEvent:loginEvent eventObj:userObj];
            });
            
            successCallback(@[userObj]);
        } else {
            failureCallback(@[@"User object not returned."]);
        }
        
    } onError:^(CommonNetworkOperation *completedOperation, NSString *prevResponsePath, NSError *error) {
        failureCallback(@[[error localizedDescription]]);
    }];
}

RCT_EXPORT_METHOD(doLogout:(RCTResponseSenderBlock)callback){
    NSHTTPCookie *sessionCookie = nil;
    
    for (NSHTTPCookie *cookie in [[NSHTTPCookieStorage sharedHTTPCookieStorage] cookies]) {
        if ([cookie.name isEqualToString:@"connect.sid"]) {
            sessionCookie = cookie;
        }
    }
    
    if (sessionCookie) {
        [[NSHTTPCookieStorage sharedHTTPCookieStorage] deleteCookie:sessionCookie];
    }
    
    [Global setLoginUser:nil plainPassword:nil userObj:nil];

    dispatch_async(dispatch_get_main_queue(), ^{
        [Global dispatchEvent:logoutEvent eventObj:@{}];
    });

    callback(@[]);
}

RCT_EXPORT_METHOD(refreshUser:(NSString*)loginName successCallback:(RCTResponseSenderBlock)successCallback failureCallback:(RCTResponseSenderBlock)failureCallback){
    [[Global engine] getUser:loginName codeBlock:^(NSString *record) {
        NSMutableDictionary *recordDict = [@{} mutableCopy];
        [recordDict addEntriesFromDictionary:[record objectFromJSONString]];
        NSArray *arr = [recordDict objectForKey:@"resultValue"];
        
        if(arr.count) {
            NSDictionary *userObj = arr[0];
            [Global setLoginUser:userObj];

            successCallback(@[userObj]);
        } else {
            failureCallback(@[@"User object not returned."]);
        }
        
    } onError:^(CommonNetworkOperation *completedOperation, NSString *prevResponsePath, NSError *error) {
        failureCallback(@[[error localizedDescription]]);
    }];
}

RCT_EXPORT_METHOD(restoreUserFromStorage:(RCTResponseSenderBlock)callback){
    callback(@[[Global getLoginUser]]);
}

RCT_EXPORT_METHOD(getProject:(NSString *)projectFilter successCallback:(RCTResponseSenderBlock)successCallback failureCallback:(RCTResponseSenderBlock)failureCallback){
    if ([projectFilter objectFromJSONString]) {
        [[Global engine] getProject:projectFilter codeBlock:^(NSString *record) {
            NSMutableDictionary *recordDict = [@{} mutableCopy];
            [recordDict addEntriesFromDictionary:[record objectFromJSONString]];
            NSArray *arr = [recordDict objectForKey:@"resultValue"];
            
            if(arr.count) {
                successCallback(@[arr]);
            } else {
                failureCallback(@[@"Project object not returned."]);
            }
            
        } onError:^(CommonNetworkOperation *completedOperation, NSString *prevResponsePath, NSError *error) {
            failureCallback(@[[error localizedDescription]]);
        }];
    } else {
        failureCallback(@[@"Empty query condition."]);
    }
}

RCT_EXPORT_METHOD(getJoinItems:(NSString *)projectId successCallback:(RCTResponseSenderBlock)successCallback failureCallback:(RCTResponseSenderBlock)failureCallback){
    if (projectId) {
        [[Global engine] getJoinItems:projectId codeBlock:^(NSString *record) {
            NSMutableDictionary *recordDict = [@{} mutableCopy];
            [recordDict addEntriesFromDictionary:[record objectFromJSONString]];
            NSArray *arr = [recordDict objectForKey:@"resultValue"];
            
            successCallback(@[arr]);
        } onError:^(CommonNetworkOperation *completedOperation, NSString *prevResponsePath, NSError *error) {
            failureCallback(@[[error localizedDescription]]);
        }];
    } else {
        failureCallback(@[@"Empty query condition."]);
    }
}

RCT_EXPORT_METHOD(saveAvatar:(RCTResponseSenderBlock)callback){
    callback(@[]);
}

@end
