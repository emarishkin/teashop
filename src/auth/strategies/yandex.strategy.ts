import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-yandex";
import { Profile } from "passport-yandex";
import { VerifyCallback } from "passport-oauth2";

@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy, 'yandex') {
    constructor(private configService: ConfigService) {
        super({
            clientID: configService.get<string>('YANDEX_CLIENT_ID')!,
            clientSecret: configService.get<string>('YANDEX_CLIENT_SECRET')!,
            callbackURL: configService.get<string>('SERVER_URL') + '/auth/yandex/callback'
        });
    }

    async validate(
        _accessToken: string,
        _refreshToken: string,
        profile: Profile,
        done: VerifyCallback
    ):Promise<any> {
        try {
            const { username, emails, photos } = profile;

            if (!emails?.[0]?.value) {
                return done(new Error("Email не предоставлен Yandex"), false);
            }

            const user = {
                email: emails[0].value,
                name: username || 'Неизвестный пользователь',
                picture: photos?.[0]?.value || null
            };

            done(null, user);
        } catch (err) {
            done(err as Error, false);
        }
    }
}