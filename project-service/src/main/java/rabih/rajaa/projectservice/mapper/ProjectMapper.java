package rabih.rajaa.projectservice.mapper;

import org.springframework.stereotype.Component;
import rabih.rajaa.projectservice.dto.ProjectDTO;
import rabih.rajaa.projectservice.entity.Project;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class ProjectMapper {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    public ProjectDTO toDTO(Project project) {
        ProjectDTO dto = new ProjectDTO();
        dto.setId(project.getId());
        dto.setTitle(project.getTitle());
        dto.setDescription(project.getDescription());
        dto.setStatus(project.getStatus());
        dto.setPriority(project.getPriority());
        dto.setStartDate(project.getStartDate() != null ? project.getStartDate().format(FORMATTER) : null);
        dto.setEndDate(project.getEndDate() != null ? project.getEndDate().format(FORMATTER) : null);
        dto.setBudget(project.getBudget());
        dto.setProgress(project.getProgress());
        dto.setCreatedAt(project.getCreatedAt());
        dto.setUpdatedAt(project.getUpdatedAt());
        return dto;
    }

    public Project toEntity(ProjectDTO dto) {
        Project project = new Project();
        project.setId(dto.getId());
        project.setTitle(dto.getTitle());
        project.setDescription(dto.getDescription());
        project.setStatus(dto.getStatus());
        project.setPriority(dto.getPriority());
        project.setStartDate(dto.getStartDate() != null ? LocalDateTime.parse(dto.getStartDate(), FORMATTER) : null);
        project.setEndDate(dto.getEndDate() != null ? LocalDateTime.parse(dto.getEndDate(), FORMATTER) : null);
        project.setBudget(dto.getBudget());
        project.setProgress(dto.getProgress());
        project.setCreatedAt(dto.getCreatedAt());
        project.setUpdatedAt(dto.getUpdatedAt());
        return project;
    }

    public void updateEntity(ProjectDTO dto, Project project) {
        if (dto.getTitle() != null) project.setTitle(dto.getTitle());
        if (dto.getDescription() != null) project.setDescription(dto.getDescription());
        if (dto.getStatus() != null) project.setStatus(dto.getStatus());
        if (dto.getPriority() != null) project.setPriority(dto.getPriority());
        if (dto.getStartDate() != null) project.setStartDate(LocalDateTime.parse(dto.getStartDate(), FORMATTER));
        if (dto.getEndDate() != null) project.setEndDate(LocalDateTime.parse(dto.getEndDate(), FORMATTER));
        if (dto.getBudget() != null) project.setBudget(dto.getBudget());
        if (dto.getProgress() != null) project.setProgress(dto.getProgress());
    }
}
