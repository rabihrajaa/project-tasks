package rabih.rajaa.taskservice.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import rabih.rajaa.taskservice.entity.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {
    Page<Task> findByProjectId(Long projectId, Pageable pageable);
    Page<Task> findByTitleContainingOrDescriptionContaining(String title, String description, Pageable pageable);

    @Query("SELECT t FROM Task t WHERE " +
           "(:title IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
           "(:description IS NULL OR LOWER(t.description) LIKE LOWER(CONCAT('%', :description, '%'))) AND " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:priority IS NULL OR t.priority = :priority) AND " +
           "(:projectId IS NULL OR t.projectId = :projectId) AND " +
           "(:assignedUserId IS NULL OR t.assignedUserId = :assignedUserId)")
    Page<Task> findWithFilters(@Param("title") String title,
                               @Param("description") String description,
                               @Param("status") String status,
                               @Param("priority") String priority,
                               @Param("projectId") Long projectId,
                               @Param("assignedUserId") Long assignedUserId,
                               Pageable pageable);
}
