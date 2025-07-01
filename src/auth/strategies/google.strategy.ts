import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, StrategyOptions, VerifyCallback } from "passport-google-oauth20";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private configService: ConfigService) {
        const options: StrategyOptions = {
            clientID: configService.get<string>('GOOGLE_CLIENT_ID')!,
            clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET')!,
            callbackURL: configService.get<string>('SERVER_URL') + '/auth/google/callback',
            scope: ['profile', 'email']
        };
        
        super(options);
    }

    async validate(
        accessToken: string, 
        refreshToken: string, 
        profile: Profile, 
        done: VerifyCallback
    ) {
        if (!profile.emails || !profile.emails.length) {
            return done(new Error("Email не предоставлен Google"), false); // Изменено null → false
        }

        const user = {
            email: profile.emails[0].value,
            name: profile.displayName,
            picture: profile.photos?.[0]?.value
        };

        done(null, user);
    }
}