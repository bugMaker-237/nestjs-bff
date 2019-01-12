import { OrgAuthCheck } from '@nestjs-bff/backend/lib/domain/core/authchecks/org.authcheck';
import { Authorization } from '@nestjs-bff/backend/lib/host/http/core/decorators/authorization.decorator';
import { BffRequest } from '@nestjs-bff/backend/lib/host/http/core/types/bff-request.contract';
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req } from '@nestjs/common';
import { ReminderRepo } from '../../../../domain/reminder/repo/reminder.repo';
import { ReminderEntity } from '../../../../global/entities/reminder.entity';

/*
  Domain Service Hosted Endpoints are RESTful, with the following best-practice structure

  GET /items - Retrieves a list of items
  GET /items/12 - Retrieves a specific item
  POST /items - Creates a new item
  PUT /items/12 - Updates item #12
  PATCH /items/12 - Partially updates item #12
  DELETE /items/12 - Deletes item #12

*/

@Controller('/reminder/:organizationSlug/:userId')
export class ReminderController {
  constructor(private readonly reminderRepo: ReminderRepo) {}

  @Get()
  @Authorization([new OrgAuthCheck()])
  public async getItems(@Param('orgId') orgId: string, @Param('userId') userId: string): Promise<ReminderEntity[]> {
    return this.reminderRepo.find({ userId, orgId });
  }

  @Get(':id')
  @Authorization([new OrgAuthCheck()])
  public async getItem(
    @Param('orgId') orgId: string,
    @Param('userId') userId: string,
    id: string,
  ): Promise<ReminderEntity> {
    return this.reminderRepo.findOne({ id, orgId, userId });
  }

  @Post()
  @Authorization([new OrgAuthCheck()])
  public async create(@Body() entity: ReminderEntity) {
    return this.reminderRepo.create(entity);
  }

  @Put()
  @Authorization([new OrgAuthCheck()])
  public async update(@Body() entity: ReminderEntity) {
    return this.reminderRepo.update(entity);
  }

  @Patch()
  @Authorization([new OrgAuthCheck()])
  public async partialUpdate(@Body() entity: Partial<ReminderEntity>) {
    return this.reminderRepo.patch(entity);
  }

  @Delete()
  @Authorization([new OrgAuthCheck()])
  public async delete(@Req() req: BffRequest, @Param('id') id) {
    return this.reminderRepo.delete(id, { accessPermissions: req.accessPermissions });
  }
}
