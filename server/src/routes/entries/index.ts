import { Router } from 'express';
import { getEntries, getEntry } from '../../controllers/entryController';
import { pagination } from '../../middlewares/pagination';

const entryRoute = Router();
entryRoute.get('/', pagination(), getEntries);
entryRoute.get('/:entryid', getEntry);
export default entryRoute;
