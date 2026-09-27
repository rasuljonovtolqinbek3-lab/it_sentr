CREATE TABLE `audit_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`action` varchar(255) NOT NULL,
	`certificate_id` varchar(255),
	`admin_identifier` varchar(255),
	`ip_address` varchar(255),
	`user_agent` text,
	`metadata` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `certificates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`certificate_id` varchar(255) NOT NULL,
	`verification_code` varchar(255) NOT NULL,
	`full_name` varchar(255) NOT NULL,
	`course_name` varchar(255) NOT NULL,
	`issue_date` timestamp NOT NULL,
	`status` varchar(50) NOT NULL DEFAULT 'ACTIVE',
	`pdf_storage_key` varchar(255),
	`document_hash` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `certificates_id` PRIMARY KEY(`id`),
	CONSTRAINT `certificates_certificate_id_unique` UNIQUE(`certificate_id`),
	CONSTRAINT `certificates_verification_code_unique` UNIQUE(`verification_code`)
);
--> statement-breakpoint
CREATE INDEX `audit_created_at_idx` ON `audit_logs` (`created_at`);--> statement-breakpoint
CREATE INDEX `audit_action_idx` ON `audit_logs` (`action`);--> statement-breakpoint
CREATE INDEX `audit_certificate_id_idx` ON `audit_logs` (`certificate_id`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `certificates` (`status`);