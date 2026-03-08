"""
Timing utility for measuring and tracking operation performance
Helps analyze question loading/sending times and API response durations
"""
import time
import logging
from typing import Dict, Any, Optional
from contextlib import contextmanager

logger = logging.getLogger(__name__)


class PerformanceTimer:
    """Track timing metrics for different operations"""
    
    def __init__(self):
        """Initialize timer with empty measurements"""
        self.measurements: Dict[str, float] = {}
        self.start_time: Optional[float] = None
    
    def start(self, operation_name: str = "total") -> None:
        """Start timing an operation"""
        self.start_time = time.time()
        self.measurements[operation_name] = 0
        logger.debug(f"⏱️  Started timing: {operation_name}")
    
    def end(self, operation_name: str = "total") -> float:
        """End timing and record elapsed time in milliseconds"""
        if self.start_time is None:
            logger.warning(f"⚠️  Timer not started for: {operation_name}")
            return 0
        
        elapsed_ms = (time.time() - self.start_time) * 1000
        self.measurements[operation_name] = elapsed_ms
        logger.debug(f"✅ Completed {operation_name}: {elapsed_ms:.2f}ms")
        return elapsed_ms
    
    def mark(self, operation_name: str) -> float:
        """Mark a single point in time (for intermediate measurements)"""
        if self.start_time is None:
            logger.warning(f"⚠️  Timer not started")
            return 0
        
        elapsed_ms = (time.time() - self.start_time) * 1000
        self.measurements[operation_name] = elapsed_ms
        logger.debug(f"🔍 Marked {operation_name}: {elapsed_ms:.2f}ms")
        return elapsed_ms
    
    def get_total_time(self) -> float:
        """Get total elapsed time since start"""
        if self.start_time is None:
            return 0
        return (time.time() - self.start_time) * 1000
    
    def get_all_measurements(self) -> Dict[str, float]:
        """Get all measurements as dictionary"""
        return self.measurements.copy()
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary format for response"""
        measurements = self.get_all_measurements()
        total = self.get_total_time()
        
        return {
            "total_time_ms": round(total, 2),
            "measurements": {k: round(v, 2) for k, v in measurements.items()}
        }
    
    def log_summary(self) -> None:
        """Log a summary of all measurements"""
        measurements = self.get_all_measurements()
        total = self.get_total_time()
        
        logger.info("=" * 60)
        logger.info("📊 PERFORMANCE SUMMARY")
        logger.info("=" * 60)
        for operation, duration in measurements.items():
            logger.info(f"  {operation}: {duration:.2f}ms")
        logger.info(f"  TOTAL: {total:.2f}ms")
        logger.info("=" * 60)


@contextmanager
def time_operation(operation_name: str = "operation"):
    """Context manager for timing code blocks"""
    start_time = time.time()
    logger.debug(f"⏱️  Starting: {operation_name}")
    
    try:
        yield
    finally:
        elapsed_ms = (time.time() - start_time) * 1000
        logger.info(f"✅ {operation_name} completed in {elapsed_ms:.2f}ms")


def get_timing_annotations() -> Dict[str, str]:
    """Get human-readable annotations for timing thresholds"""
    return {
        "fast": "< 100ms (Excellent - Cached from DB)",
        "normal": "100-500ms (Good - Quick API response)",
        "slow": "500-2000ms (Acceptable - Gemini generating questions)",
        "very_slow": "> 2000ms (Slow - First time API call with generation)"
    }


def classify_timing(total_ms: float) -> str:
    """Classify timing performance"""
    if total_ms < 100:
        return "fast"
    elif total_ms < 500:
        return "normal"
    elif total_ms < 2000:
        return "slow"
    else:
        return "very_slow"
