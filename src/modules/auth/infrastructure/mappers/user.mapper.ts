import { UserSchema, type User } from '../../domain/entities/user';

interface ApiUserDTO {
	id: string;
	email: string;
	full_name: string;
	role: string;
	tenant_id: string;
}

/**
 * Maps API snake_case DTOs to domain camelCase entities.
 */
export const UserMapper = {
	toDomain(dto: ApiUserDTO): User {
		return {
			id: dto.id,
			email: dto.email,
			name: dto.full_name,
			role: UserSchema.shape.role.parse(dto.role),
			tenantId: dto.tenant_id,
		};
	},

	toDTO(user: User): ApiUserDTO {
		return {
			id: user.id,
			email: user.email,
			full_name: user.name,
			role: user.role,
			tenant_id: user.tenantId,
		};
	},
};
