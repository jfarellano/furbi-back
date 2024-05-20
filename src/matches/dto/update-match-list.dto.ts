import { IsNotEmpty } from 'class-validator';

export class UpdateMatchListDto {
  @IsNotEmpty()
  playerList: {
    "userId": number,
    "teamId": string
  }[]
}
