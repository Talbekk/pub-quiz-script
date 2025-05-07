import { Router } from 'express';
import { getEntries, getEntry } from '../../controllers/entryController';

const entryRoute = Router();
entryRoute.get('', getEntries);
entryRoute.get('/:entryid', getEntry);
export default entryRoute;
