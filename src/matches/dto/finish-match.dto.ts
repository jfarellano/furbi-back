import { IsNotEmpty } from 'class-validator';
import { MatchResult } from '../entities/match.entity';

export class FinishMatchDto {
  @IsNotEmpty()
  result: MatchResult;
}
